const RoomTypeEnum = {
  POST_ROOM: "post_room",
  LOOKING_FOR_ROOMMATES: "looking_for_roommates",
};

const RoomCategoryEnum = {
  SELF_MANAGED_BOARDING_HOUSE: "Self-managed boarding house",
  MANAGED_BOARDING_HOUSE: "Managed boarding house",
  DORMITORY: "Dormitory",
  APARTMENT: "Apartment",
  HOMESTAY: "Homestay",
  FULL_HOUSE: "Full-house",
};

const RoomStatusEnum = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  UNDER_REVIEW: "under_review",
  REJECTED: "rejected",
};

module.exports = {
  RoomTypeEnum,
  RoomCategoryEnum,
  RoomStatusEnum,
};
