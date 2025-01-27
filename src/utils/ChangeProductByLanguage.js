const ConvertInformationPlantAndSeedFollowLanguage = (language, plant) => {
  const formattedPlant = {
    _id: plant._id,
    name: plant.name[language] || plant.name.en,
    sub_name: plant.sub_name[language] || plant.sub_name.en,
    genus_id: {
      name: plant.genus_id.name[language] || plant.genus_id.name.en,
    },
    img_url: plant.img_url,
    video_url: plant.video_url,
    quantity: plant.quantity,
    height: plant.height,
    width: plant.width,
    zones: plant.zones[language] || plant.zones.en,
    uses: plant.uses[language] || plant.uses.en,
    tolerance: plant.tolerance[language] || plant.tolerance.en,
    bloom_time: plant.bloom_time[language] || plant.bloom_time.en,
    light: plant.light[language] || plant.light.en,
    moisture: plant.moisture[language] || plant.moisture.en,
    maintenance: plant.maintenance[language] || plant.maintenance.en,
    growth_rate: plant.growth_rate[language] || plant.growth_rate.en,
    plant_type_id: {
      plant_type_name:
        plant.plant_type_id.plant_type_name[language] ||
        plant.plant_type_id.plant_type_name.en,
    },
    plant_seasonal_interest:
      plant.plant_seasonal_interest[language] ||
      plant.plant_seasonal_interest.en,
    describe: plant.describe[language] || plant.describe.en,
    noteworthy_characteristics:
      plant.noteworthy_characteristics[language] ||
      plant.noteworthy_characteristics.en,
    care: plant.care[language] || plant.care.en,
    propagation: plant.propagation[language] || plant.propagation.en,
    problems: plant.problems[language] || plant.problems.en,
    water: plant.water[language] || plant.water.en,
    humidity: plant.humidity[language] || plant.humidity.en,
    fertilizer: plant.fertilizer[language] || plant.fertilizer.en,
    size: plant.size,
    price: plant.price,
    average_rating: plant.average_rating,
    status: plant.status,
    createdAt: plant.createdAt,
    updatedAt: plant.updatedAt,
  };
  return formattedPlant;
};

const ConvertListInformationPlantAndSeedFollowLanguage = (language, plants) => {
  const formattedPlants = plants.map((plant) => {
    return {
      _id: plant._id,
      name: plant.name[language] || plant.name.en,
      sub_name: plant.sub_name[language] || plant.sub_name.en,
      genus_id: {
        name: plant.genus_id.name[language] || plant.genus_id.name.en,
      },
      img_url: plant.img_url,
      video_url: plant.video_url,
      quantity: plant.quantity,
      height: plant.height,
      width: plant.width,
      zones: plant.zones[language] || plant.zones.en,
      uses: plant.uses[language] || plant.uses.en,
      tolerance: plant.tolerance[language] || plant.tolerance.en,
      bloom_time: plant.bloom_time[language] || plant.bloom_time.en,
      light: plant.light[language] || plant.light.en,
      moisture: plant.moisture[language] || plant.moisture.en,
      maintenance: plant.maintenance[language] || plant.maintenance.en,
      growth_rate: plant.growth_rate[language] || plant.growth_rate.en,
      plant_type_id: {
        plant_type_name:
          plant.plant_type_id.plant_type_name[language] ||
          plant.plant_type_id.plant_type_name.en,
      },
      plant_seasonal_interest:
        plant.plant_seasonal_interest[language] ||
        plant.plant_seasonal_interest.en,
      describe: plant.describe[language] || plant.describe.en,
      noteworthy_characteristics:
        plant.noteworthy_characteristics[language] ||
        plant.noteworthy_characteristics.en,
      care: plant.care[language] || plant.care.en,
      propagation: plant.propagation[language] || plant.propagation.en,
      problems: plant.problems[language] || plant.problems.en,
      water: plant.water[language] || plant.water.en,
      humidity: plant.humidity[language] || plant.humidity.en,
      fertilizer: plant.fertilizer[language] || plant.fertilizer.en,
      size: plant.size,
      price: plant.price,
      average_rating: plant.average_rating,
      status: plant.status,
      createdAt: plant.createdAt,
      updatedAt: plant.updatedAt,
    };
  });
  return formattedPlants;
};

const ConvertInformationPlanterFollowLanguage = (language, planter) => {
  const formattedPlanter = {
    _id: planter._id,
    name: planter.name[language] || planter.name.en,
    category: planter.category[language] || planter.category.en,
    img_object: planter.img_object.map((img) => ({
      img_url: img.img_url,
      color: img.color,
    })),
    video_url: planter.video_url,
    price: planter.price,
    size: planter.size[language] || planter.size.en,
    introduction: planter.introduction[language] || planter.introduction.en,
    material: planter.material[language] || planter.material.en,
    special_feature:
      planter.special_feature[language] || planter.special_feature.en,
    style: planter.style[language] || planter.style.en,
    planter_form: planter.planter_form[language] || planter.planter_form.en,
    about: planter.about[language] || planter.about.en,
    describe: planter.describe[language] || planter.describe.en,
    default_color: planter.default_color,
    theme: planter.theme[language] || planter.theme.en,
    finish_type: planter.finish_type[language] || planter.finish_type.en,
    item_weight: planter.item_weight,
    manufacturer: planter.manufacturer[language] || planter.manufacturer.en,
    ASIN: planter.ASIN,
    item_model_number:
      planter.item_model_number[language] || planter.item_model_number.en,
    customer_reviews: planter.customer_reviews,
    best_seller_rank:
      planter.best_seller_rank[language] || planter.best_seller_rank.en,
    date_first_available: planter.date_first_available,
    status: planter.status,
    average_rating: planter.average_rating,
    createdAt: planter.createdAt,
    updatedAt: planter.updatedAt,
  };

  return formattedPlanter;
};

const ConvertListInformationPlanterFollowLanguage = (language, planters) => {
  const formattedPlanters = planters.map((planter) => ({
    _id: planter._id,
    name: planter.name[language] || planter.name.en,
    category: planter.category[language] || planter.category.en,
    img_object: planter.img_object.map((img) => ({
      img_url: img.img_url,
      color: img.color,
    })),
    video_url: planter.video_url,
    price: planter.price,
    size: planter.size,
    introduction: planter.introduction[language] || planter.introduction.en,
    material: planter.material[language] || planter.material.en,
    special_feature:
      planter.special_feature[language] || planter.special_feature.en,
    style: planter.style[language] || planter.style.en,
    planter_form: planter.planter_form[language] || planter.planter_form.en,
    about: planter.about[language] || planter.about.en,
    describe: planter.describe[language] || planter.describe.en,
    default_color: planter.default_color,
    theme: planter.theme[language] || planter.theme.en,
    finish_type: planter.finish_type[language] || planter.finish_type.en,
    item_weight: planter.item_weight,
    manufacturer: planter.manufacturer[language] || planter.manufacturer.en,
    ASIN: planter.ASIN,
    item_model_number: planter.item_model_number,
    customer_reviews: planter.customer_reviews,
    best_seller_rank:
      planter.best_seller_rank[language] || planter.best_seller_rank.en,
    date_first_available: planter.date_first_available,
    status: planter.status,
    average_rating: planter.average_rating,
    createdAt: planter.createdAt,
    updatedAt: planter.updatedAt,
  }));

  return formattedPlanters;
};

module.exports = {
  ConvertInformationPlantAndSeedFollowLanguage,
  ConvertInformationPlanterFollowLanguage,
  ConvertListInformationPlantAndSeedFollowLanguage,
  ConvertListInformationPlanterFollowLanguage,
};
