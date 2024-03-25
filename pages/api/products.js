import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect()
  // await isAdminRequest(req, res)

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }))
    } else {
      res.json(await Product.find())
    }

  }

  if (method === "POST") {
    const { id,
      namespaceId,
      name,
      capacityAvailable,
      capacity,
      priceRegular,
      priceDiscount,
      colorsAvailable,
      color,
      images,
      description,
      screen,
      resolution,
      processor,
      ram,
      camera,
      zoom,
      cell,
      article,
      category,
      currentCategory } = req.body;

    console.log(req.body)
    const productDoc = await Product.create({
      id,
      namespaceId,
      name,
      capacityAvailable,
      capacity,
      priceRegular,
      priceDiscount,
      colorsAvailable,
      color,
      images,
      description,
      screen,
      resolution,
      processor,
      ram,
      camera,
      zoom,
      cell,
      article,
      category: currentCategory,
      currentCategory: category,
    })
    console.log(productDoc)
    res.json(productDoc)
  }

  if (method === "PUT") {
    const { id,
      namespaceId,
      name,
      capacityAvailable,
      capacity,
      priceRegular,
      priceDiscount,
      colorsAvailable,
      color,
      images,
      description,
      screen,
      resolution,
      processor,
      ram,
      camera,
      zoom,
      cell,
      article,
      category,
      currentCategory, _id } = req.body;
    await Product.updateOne({ _id }, {
      id,
      namespaceId,
      name,
      capacityAvailable,
      capacity,
      priceRegular,
      priceDiscount,
      colorsAvailable,
      color,
      images,
      description,
      screen,
      resolution,
      processor,
      ram,
      camera,
      zoom,
      cell,
      article,
      category,
      currentCategory,
    });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true)
    }
  }
};
