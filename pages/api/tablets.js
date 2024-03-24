import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect()

  if (method === "GET") {
      if (req.query?.id) {
          res.json(await Product.findOne({ id: req.query.id }))
      } else {
        try {
          res.json(await Product.find({ category: "tablets" }))
        } catch (error) {
          res.status(404).json([]);
        }
      }
  }
};