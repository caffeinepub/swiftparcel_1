import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Parcel = {
    id : Nat;
    senderId : Principal;
    pickupAddress : Text;
    deliveryAddress : Text;
    description : Text;
    weight : Float;
    deliveryType : DeliveryType;
    status : Status;
    createdTimestamp : Int;
    assignedRiderId : ?Principal;
    priceEstimate : Float;
  };

  type DeliveryType = {
    #local;
    #state;
    #international;
  };

  type Status = {
    #pending;
    #assigned;
    #pickedUp;
    #inTransit;
    #delivered;
    #cancelled;
  };

  type ParcelInput = {
    pickupAddress : Text;
    deliveryAddress : Text;
    description : Text;
    weight : Float;
    deliveryType : DeliveryType;
  };

  type RiderProfile = {
    id : Principal;
    name : Text;
    bikeModel : Text;
    phone : Text;
    status : AvailabilityStatus;
    vehicleType : VehicleType;
  };

  type VehicleType = {
    #bike;
    #car;
    #van;
  };

  type AvailabilityStatus = {
    #available;
    #busy;
    #offline;
  };

  let parcels = Map.empty<Nat, Parcel>();
  let riders = Map.empty<Principal, RiderProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  var nextParcelId = 1;

  func checkRole(requiredRole : AccessControl.UserRole, caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, requiredRole))) {
      let roleText = switch (requiredRole) {
        case (#admin) { "admins" };
        case (#user) { "users" };
        case (#guest) { "guests" };
      };
      Runtime.trap("Unauthorized: Only " # roleText # " can perform this action");
    };
  };

  public shared ({ caller }) func createParcel(input : ParcelInput) : async Float {
    checkRole(#user, caller);

    let price = calculatePrice(input.deliveryType, input.weight);

    let parcel : Parcel = {
      id = nextParcelId;
      senderId = caller;
      pickupAddress = input.pickupAddress;
      deliveryAddress = input.deliveryAddress;
      description = input.description;
      weight = input.weight;
      deliveryType = input.deliveryType;
      status = #pending;
      createdTimestamp = Time.now();
      assignedRiderId = null;
      priceEstimate = price;
    };

    parcels.add(nextParcelId, parcel);
    nextParcelId += 1;

    price;
  };

  func calculatePrice(deliveryType : DeliveryType, weight : Float) : Float {
    let basePrice = switch (deliveryType) {
      case (#local) { 10.0 };
      case (#state) { 25.0 };
      case (#international) { 100.0 };
    };
    basePrice + (weight * 2.5);
  };

  public query ({ caller }) func getMyParcels() : async [Parcel] {
    checkRole(#user, caller);
    parcels.values().toArray().filter(func(p) { p.senderId == caller });
  };

  public query ({ caller }) func getRiderParcels() : async [Parcel] {
    checkRole(#user, caller);
    parcels.values().toArray().filter(func(p) { p.assignedRiderId == ?caller });
  };

  public query ({ caller }) func getParcelStatusCounts() : async [(Text, Nat)] {
    // Public analytics endpoint - no authorization required
    let statusCounts = Map.empty<Text, Nat>();

    parcels.values().toArray().forEach(
      func(parcel) {
        let statusText = switch (parcel.status) {
          case (#pending) { "pending" };
          case (#assigned) { "assigned" };
          case (#pickedUp) { "pickedUp" };
          case (#inTransit) { "inTransit" };
          case (#delivered) { "delivered" };
          case (#cancelled) { "cancelled" };
        };

        switch (statusCounts.get(statusText)) {
          case (null) {
            statusCounts.add(statusText, 1);
          };
          case (?count) {
            statusCounts.add(statusText, count + 1);
          };
        };
      }
    );

    statusCounts.toArray();
  };

  public shared ({ caller }) func assignRider(parcelId : Nat, riderId : Principal) : async () {
    checkRole(#admin, caller);

    let parcel = switch (parcels.get(parcelId)) {
      case (null) { Runtime.trap("Parcel not found") };
      case (?p) { p };
    };

    if (parcel.status != #pending) {
      Runtime.trap("Parcel is not pending");
    };

    let rider = switch (riders.get(riderId)) {
      case (null) { Runtime.trap("Rider not found") };
      case (?r) { r };
    };

    if (claimsCompleted(rider.id) > 10) {
      Runtime.trap("Rider is too busy");
    };

    let updatedParcel : Parcel = {
      parcel with
      status = #assigned;
      assignedRiderId = ?riderId;
    };

    parcels.add(parcelId, updatedParcel);
  };

  public shared ({ caller }) func updateParcelStatus(parcelId : Nat, status : Status) : async () {
    let parcel = switch (parcels.get(parcelId)) {
      case (null) { Runtime.trap("Parcel not found") };
      case (?p) { p };
    };

    switch (status) {
      case (#pickedUp) {
        checkRole(#user, caller);

        switch (parcel.assignedRiderId) {
          case (?riderId) {
            if (riderId == caller) {
              let updatedParcel = { parcel with status };
              parcels.add(parcelId, updatedParcel);
              return;
            };
          };
          case (null) {};
        };

        Runtime.trap("Unauthorized: Only assigned rider can update status");
      };
      case (#inTransit) {
        checkRole(#user, caller);

        switch (parcel.assignedRiderId) {
          case (?riderId) {
            if (riderId == caller) {
              let updatedParcel = { parcel with status };
              parcels.add(parcelId, updatedParcel);
              return;
            };
          };
          case (null) {};
        };

        Runtime.trap("Unauthorized: Only assigned rider can update status");
      };
      case (#delivered) {
        checkRole(#user, caller);

        switch (parcel.assignedRiderId) {
          case (?riderId) {
            if (riderId == caller) {
              let updatedParcel = { parcel with status };
              parcels.add(parcelId, updatedParcel);
              return;
            };
          };
          case (null) {};
        };

        Runtime.trap("Unauthorized: Only assigned rider can update status");
      };
      case (#cancelled) {
        checkRole(#user, caller);
        if (parcel.senderId != caller) {
          Runtime.trap("Unauthorized: Only parcel creator can cancel");
        };
        let updatedParcel = { parcel with status };
        parcels.add(parcelId, updatedParcel);
      };
      case (_) {
        checkRole(#admin, caller);
        let updatedParcel = { parcel with status };
        parcels.add(parcelId, updatedParcel);
      };
    };
  };

  public shared ({ caller }) func registerRider(name : Text, bikeModel : Text, phone : Text, vehicleType : VehicleType) : async () {
    checkRole(#user, caller);
    checkUniqueRider(caller);

    let rider : RiderProfile = {
      id = caller;
      name;
      bikeModel;
      phone;
      status = #available;
      vehicleType;
    };

    riders.add(caller, rider);
  };

  public shared ({ caller }) func updateRiderAvailability(status : AvailabilityStatus) : async () {
    checkRole(#user, caller);
    let rider = getRider(caller);
    let updatedRider = { rider with status };
    riders.add(caller, updatedRider);
  };

  public query ({ caller }) func getAllAvailableRiders() : async [RiderProfile] {
    checkRole(#admin, caller);
    riders.values().toArray().filter(func(r) { r.status == #available });
  };

  public query ({ caller }) func getAllParcels() : async [Parcel] {
    checkRole(#admin, caller);
    parcels.values().toArray();
  };

  func checkUniqueRider(riderId : Principal) {
    if (riders.containsKey(riderId)) {
      Runtime.trap("Rider already exists");
    };
  };

  func claimsCompleted(riderId : Principal) : Nat {
    parcels.values().toArray().filter(func(p) { p.assignedRiderId == ?riderId and p.status == #delivered }).size();
  };

  func getRider(riderId : Principal) : RiderProfile {
    switch (riders.get(riderId)) {
      case (null) { Runtime.trap("Rider not found") };
      case (?r) { r };
    };
  };
};
