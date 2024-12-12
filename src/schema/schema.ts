import {
  pgTable,
  serial,
  text,
  varchar,
  numeric,
  integer,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  business_name: text("business_name"),
  review_count: integer("review_count"),
  review_score: real("review_score"),
  place_id: varchar("place_id", { length: 256 }),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  business_id: integer("business_id")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  lookup_id: text("lookup_id"), // ID on the review platform
  author_name: text("author_name"),
  author_image: text("author_image"),
  datetime: timestamp("datetime"),
  link: text("link"),
  rating: integer("rating"),
  comments: text("comments"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
