import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { businesses, reviews } from "../src/schema/crud";
import { db } from "../src/schema/db";
import { desc, eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/fetch-reviews", async (req: Request, res: Response) => {
  try {
    businesses.select.parse(req.body);
    const business = db
      .select({ id: businesses.table.id })
      .from(businesses.table)
      .where(eq(businesses.table.place_id, req.body.place_id))
      .as("business");
    const businessReviews = await db
      .select({
        author_name: reviews.table.author_name,
        author_image: reviews.table.author_image,
        datetime: reviews.table.datetime,
        link: reviews.table.link,
        rating: reviews.table.rating,
        comments: reviews.table.comments,
      })
      .from(reviews.table)
      .innerJoin(business, eq(reviews.table.business_id, business.id))
      .orderBy(desc(reviews.table.datetime))
      .limit(30);
    console.log(businessReviews);
    res.json(businessReviews);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
    return;
  }
});
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

module.exports = app;
