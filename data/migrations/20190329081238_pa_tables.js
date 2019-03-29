exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("projects", tbl => {
      tbl.increments();

      tbl
        .string("project_name")
        .notNullable()
        .unique();

      tbl.string("project_description").notNullable();

      tbl.boolean("project_completed").notNullable();
    })
    .createTable("actions", tbl => {
      tbl.increments("action_id");

      tbl
        .integer("project_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("projects")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      tbl.string("action_name").notNullable();

      tbl.string("action_description").notNullable();

      tbl.string("notes");

      tbl.boolean("action_completed").notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("projects").dropTableIfExists("actions");
};
