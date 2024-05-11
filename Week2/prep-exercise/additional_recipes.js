const CREATE_DATABASE = [
    `
        DROP DATABASE IF EXISTS yemenirecipesdb;
    `,
    `
        CREATE DATABASE IF NOT EXISTS yemenirecipesdb;
    `,
    `
        USE yemenirecipesdb;
    `
  ];
  
  const CREATE_TABLES = [
    `
    CREATE TABLE IF NOT EXISTS Recipe (
      recipe_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      recipe_name VARCHAR(100) NOT NULL     
    );`,
    `
    CREATE TABLE IF NOT EXISTS Category (
      category_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      category_name TEXT NOT NULL
    );`,
    `
      CREATE TABLE IF NOT EXISTS Ingredient (
        ingredient_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        ingredient_name VARCHAR(100) NOT NULL
    );`,
    `
      CREATE TABLE IF NOT EXISTS Step (
        step_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        step_description TEXT NOT NULL
    );`,
    `
      CREATE TABLE IF NOT EXISTS recipe_category (
        recipe_id INT,
        category_id INT,
        FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
        FOREIGN KEY (category_id) REFERENCES Category(category_id),
        PRIMARY KEY (recipe_id, category_id)
    );`,
    `
      CREATE TABLE IF NOT EXISTS recipe_ingredient (
        recipe_id INT,
        ingredient_id INT,
        FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
        FOREIGN KEY (ingredient_id) REFERENCES Ingredient(ingredient_id),
        PRIMARY KEY (recipe_id, ingredient_id)
    );`,
    `
      CREATE TABLE IF NOT EXISTS recipe_step (
        recipe_id INT,
        step_id INT,
        FOREIGN KEY (recipe_id) REFERENCES Recipe(recipe_id),
        FOREIGN KEY (step_id) REFERENCES Step(step_id),
        PRIMARY KEY (recipe_id, step_id)
    );`
  ];
  
  const recipes = [
      {
        recipe_name: 'No-Bake Cheesecake'
      },
      {
        recipe_name: 'Roasted Brussels Sprouts'
      },
      {
        recipe_name: 'Mac & Cheese'
      },
      {
        recipe_name: 'Tamagoyaki Japanese Omelette'
      }
    ];
    
    const categories = [
      {
        category_name: 'No-Bake'
      },
      {
        category_name: 'Cake'
      },
      {
        category_name: 'Vegetarian'
      },
      {
        category_name: 'Vegan'
      },
      {
        category_name: 'Gluten-free'
      },
      {
        category_name: 'Japanese'
      }
    ];
    
    const ingredients = [
      {
        ingredient_name: 'Condensed milk'
      },
      {
        ingredient_name: 'Cream Cheese'
      },
      {
        ingredient_name: 'Lemon Juice'
      },
      {
        ingredient_name: 'Pie Crust'
      },
      {
        ingredient_name: 'Cherry Jam'
      },
      {
        ingredient_name: 'Brussels Sprouts'
      },
      {
        ingredient_name: 'Sesame seeds'
      },
      {
        ingredient_name: 'Pepper'
      },
      {
        ingredient_name: 'Salt'
      },
      {
        ingredient_name: 'Olive oil'
      },
      {
        ingredient_name: 'Macaroni'
      },
      {
        ingredient_name: 'Butter'
      },
      {
        ingredient_name: 'Flour'
      },
      {
        ingredient_name: 'Milk'
      },
      {
        ingredient_name: 'Shredded Cheddar cheese'
      },
      {
        ingredient_name: 'Eggs'
      },
      {
        ingredient_name: 'Soy sauce'
      },
      {
        ingredient_name: 'Sugar'
      }
    ];
    
    const steps = [
      {
        step_description: 'Beat Cream Cheese'
      },
      {
        step_description: 'Add condensed Milk and blend'
      },
      {
        step_description: 'Add Lemon Juice and blend'
      },
      {
        step_description: 'Add the mix to the pie crust'
      },
      {
        step_description: 'Spread the Cherry Jam'
      },
      {
        step_description: 'Place in refrigerator for 3h'
      },
      {
        step_description: 'Preheat the oven'
      },
      {
        step_description: 'Mix the ingredients in a bowl'
      },
      {
        step_description: 'Spread the mix on baking sheet'
      },
      {
        step_description: 'Bake for 30'
      },
      {
        step_description: 'Cook Macaroni for 8'
      },
      {
        step_description: 'Melt butter in a saucepan'
      },
      {
        step_description: 'Add Milk and mix'
      },
      {
        step_description: 'Add cheddar cheese'
      },
      {
        step_description: 'Add the macaroni'
      },
      {
        step_description: 'Beat the eggs'
      },
      {
        step_description: 'Add soya sauce, sugar and salt'
      },
      {
        step_description: 'Add oil to a sauce pan'
      },
      {
        step_description: 'Bring to medium heat'
      },
      {
        step_description: 'Add some mix to the sauce pan'
      },
      {
        step_description: 'Let is cook for 1'
      },
      {
        step_description: 'Remove pan from fire'
      },
    ];
    
    const recipeCategories = [
      { recipe_id: 1, category_id: 1 },
      { recipe_id: 1, category_id: 2 },
      { recipe_id: 1, category_id: 3 },
      { recipe_id: 2, category_id: 4 },
      { recipe_id: 2, category_id: 5 },
      { recipe_id: 3, category_id: 3 },
      { recipe_id: 4, category_id: 3 },
      { recipe_id: 4, category_id: 6 },
    ];
    
    const recipeIngredients = [
      { recipe_id: 1, ingredient_id: 1 },
      { recipe_id: 1, ingredient_id: 2 },
      { recipe_id: 1, ingredient_id: 3 },
      { recipe_id: 1, ingredient_id: 4 },
      { recipe_id: 1, ingredient_id: 5 },
      { recipe_id: 2, ingredient_id: 6 },
      { recipe_id: 2, ingredient_id: 3 },
      { recipe_id: 2, ingredient_id: 7 },
      { recipe_id: 2, ingredient_id: 8 },
      { recipe_id: 2, ingredient_id: 9 },
      { recipe_id: 2, ingredient_id: 10 },
      { recipe_id: 3, ingredient_id: 11 },
      { recipe_id: 3, ingredient_id: 12 },
      { recipe_id: 3, ingredient_id: 13 },
      { recipe_id: 3, ingredient_id: 9 },
      { recipe_id: 3, ingredient_id: 8 },
      { recipe_id: 3, ingredient_id: 14 },
      { recipe_id: 3, ingredient_id: 15 },
      { recipe_id: 4, ingredient_id: 16 },
      { recipe_id: 4, ingredient_id: 17 },
      { recipe_id: 4, ingredient_id: 18 },
      { recipe_id: 4, ingredient_id: 9 },
      { recipe_id: 4, ingredient_id: 10 },
    ];
    
    const recipeSteps = [
      { recipe_id: 1, step_id: 1 },
      { recipe_id: 1, step_id: 2 },
      { recipe_id: 1, step_id: 3 },
      { recipe_id: 1, step_id: 4 },
      { recipe_id: 1, step_id: 5 },
      { recipe_id: 1, step_id: 6 },
      { recipe_id: 2, step_id: 7 },
      { recipe_id: 2, step_id: 8 },
      { recipe_id: 2, step_id: 9 },
      { recipe_id: 2, step_id: 10 },
      { recipe_id: 3, step_id: 11 },
      { recipe_id: 3, step_id: 12 },
      { recipe_id: 3, step_id: 13 },
      { recipe_id: 3, step_id: 14 },
      { recipe_id: 3, step_id: 15 },
      { recipe_id: 4, step_id: 16 },
      { recipe_id: 4, step_id: 17 },
      { recipe_id: 4, step_id: 18 },
      { recipe_id: 4, step_id: 19 },
      { recipe_id: 4, step_id: 20 },
      { recipe_id: 4, step_id: 21 },
      { recipe_id: 4, step_id: 22 },
    ];
        
    const queries = [
      {
        question: "Vegetarian recipes that include potatoes:",
        query:
            `
            SELECT
                recipe_name
            FROM
                recipe AS R
                JOIN recipe_category RC ON R.recipe_id = RC.recipe_id
                JOIN category AS C ON RC.category_id = C.category_id
                JOIN recipe_ingredient AS RI ON R.recipe_id = RI.recipe_id
                JOIN ingredient I ON RI.ingredient_id = I.ingredient_id
            WHERE
                C.category_name = 'Vegetarian'
                AND I.ingredient_name LIKE '%potatoes%';
            `
      }
      ,
      {
        question: "Cake recipes that do not need baking:",
        query:
            `
            SELECT
                recipe_name
            FROM
                recipe AS R
                JOIN recipe_category RC ON R.recipe_id = RC.recipe_id
                JOIN category AS C ON RC.category_id = C.category_id
            WHERE
                C.category_name = 'No-Bake';
            `
      },
      {
        question: "Recipes found under Japanese and Vegetarian categories:",
        query:
            `
            SELECT DISTINCT 
                recipe_name
            FROM
                recipe AS R
                JOIN recipe_category RC ON R.recipe_id = RC.recipe_id
                JOIN category AS C ON RC.category_id = C.category_id
            WHERE
                C.category_name = 'Japanese'
                OR C.category_name = 'Vegetarian';
            `
      }
    ];
  
  
    module.exports = {
      CREATE_DATABASE,
      CREATE_TABLES,
      recipes,
      categories,
      ingredients,
      steps,
      recipeCategories,
      recipeIngredients,
      recipeSteps,
      queries
    };