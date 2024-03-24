import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect()

  if (method === "GET") {
    const slug = req.query.slug;
    console.log('load accesories')
    if (slug && slug.length > 0) {
      const id = slug[slug.length - 1]; // get the last segment of the path
      res.json(await Product.findOne({ id: id }))
    } else {
      try {
        res.json(await Product.find({ category: "tablets" }))
      } catch (error) {
        res.status(404).json([]);
      }
    }
  }
};