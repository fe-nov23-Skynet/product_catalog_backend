/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  id: existingId,
  namespaceId: existingNamespaceId,
  name: existingName,
  capacityAvailable: existingCapacityAvailable,
  capacity: existingCapasity,
  priceRegular: existingPriceRegular,
  priceDiscount: existingPriceDiscount,
  colorsAvailable: existingColorsAvailable,
  color: existingColor,
  images: existingImages,
  description: existingDescription,
  screen: existingScreen,
  resolution: existingResolution,
  processor: existingProcessor,
  ram: existingRam,
  camera: existingCamera,
  zoom: existingZoom,
  cell: existingCell,
  article: existingArticle,
  currentCategory: existingCurrentCategory,


  category: assignedCategory,


  dynamicCharacteristics: existingDynamicCharacteristics,
}) {
  const [id, setId] = useState(existingId || "");
  const [namespaceId, setNamespaceId] = useState(existingNamespaceId || "");
  const [name, setName] = useState(existingName || "");
  const [capacityAvailable, setCapacityAvailable] = useState(existingCapacityAvailable || []);
  const [capacity, setCapacity] = useState(existingCapasity || "");
  const [priceRegular, setPriceRegular] = useState(existingPriceRegular || "");
  const [priceDiscount, setPriceDiscount] = useState(existingPriceDiscount || "");
  const [colorsAvailable, setColorsAvailable] = useState(existingColorsAvailable || []);
  const [color, setColor] = useState(existingColor || "");
  const [images, setImages] = useState(existingImages || []);
  const [description, setDescription] = useState(existingDescription || []);
  const [screen, setScreen] = useState(existingScreen || '');
  const [resolution, setResolution] = useState(existingResolution || '');
  const [processor, setProcessor] = useState(existingProcessor || '');
  const [ram, setRam] = useState(existingRam || '');
  const [camera, setCamera] = useState(existingCamera || '');
  const [zoom, setZoom] = useState(existingZoom || '');
  const [cell, setCell] = useState(existingCell || []);
  const [article, setArticle] = useState(existingArticle || []);
  const [category, setCategory] = useState(assignedCategory || "");

  const [currentCategory, setCurrentCategory] = useState(existingCurrentCategory || "");

  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  // const [category, setCategory] = useState(existingCategory || []);

  const [dynamicCharacteristics, setDynamicCharacteristics] = useState(existingDynamicCharacteristics || []);

  const [goToProducts, setGoToProducts] = useState(false);


  const router = useRouter();

  useEffect(() => {
    setDynamicCharacteristics(existingDynamicCharacteristics || []);
  }, [existingDynamicCharacteristics]);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
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
    };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  //#region

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  //Характеристики
  function addCharacteristic() {
    setDynamicCharacteristics((prevCharacteristics) => [
      ...prevCharacteristics,
      { key: "", value: "" },
    ]);
  }

  function updateCharacteristic(index, key, value) {
    setDynamicCharacteristics((prevCharacteristics) => {
      const newCharacteristics = [...prevCharacteristics];
      newCharacteristics[index] = { key, value };
      return newCharacteristics;
    });
  }

  function removeCharacteristic(index) {
    setDynamicCharacteristics((prevCharacteristics) => {
      const newCharacteristics = [...prevCharacteristics];
      newCharacteristics.splice(index, 1);
      return newCharacteristics;
    });
  }
  //Характеристики

  //#region Capacity Available
  function addCapacity() {
    setCapacityAvailable((prevCapacity) => [...prevCapacity, ""]);
  }

  function updateCapacity(index, value) {
    setCapacityAvailable((prevCapacity) => {
      const newCapacity = [...prevCapacity];
      newCapacity[index] = value;
      return newCapacity;
    });
  }

  function removeCapacity(index) {
    setCapacityAvailable((prevCapacity) => {
      const newCapacity = [...prevCapacity];
      newCapacity.splice(index, 1);
      return newCapacity;
    });
  }
  //#endregion

  //#region Colors Available
  function addColor() {
    setColorsAvailable((prevCapacity) => [...prevCapacity, ""]);
  }

  function updateColor(index, value) {
    setColorsAvailable((prev) => {
      const newItem = [...prev];
      newItem[index] = value;
      return newItem;
    });
  }

  function removeColor(index) {
    setColorsAvailable((prev) => {
      const newItem = [...prev];
      newItem.splice(index, 1);
      return newItem;
    });
  }
  //#endregion

  //#region Description
  function addDescription() {
    setDescription((prev) => [
      ...prev,
      { title: "", text: [] },
    ]);
  }

  function updateDescription(index, title, text) {
    setDescription((prev) => {
      const newItem = [...prev];
      newItem[index] = { title, text:[text] };
      return newItem;
    });
  }

  function removeDescription(index) {
    setDescription((prev) => {
      const newItem = [...prev];
      newItem.splice(index, 1);
      return newItem;
    });
  }
  //#endregion

  //#region Cell
  function addCell() {
    setCell((prevCapacity) => [...prevCapacity, ""]);
  }

  function updateCell(index, value) {
    setCell((prev) => {
      const newItem = [...prev];
      newItem[index] = value;
      return newItem;
    });
  }

  function removeCell(index) {
    setCell((prev) => {
      const newItem = [...prev];
      newItem.splice(index, 1);
      return newItem;
    });
  }
  //#endregion

  return (
    <form onSubmit={saveProduct}>
      <div className="input-block grid-2">
        <label>
          ID
          <input
            type="text"
            placeholder="apple-iphone-11-128gb-black"
            value={id}
            onChange={(ev) => setId(ev.target.value)}
          />
        </label>
        <label>
          namespaceId
          <input
            type="text"
            placeholder="apple-iphone-11"
            value={namespaceId}
            onChange={(ev) => setNamespaceId(ev.target.value)}
          />
        </label>
        <label>
          name
          <input
            type="text"
            placeholder="Apple iPhone 11 128GB Black"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
        </label>

        <div>
          <h2>Capacity Available</h2>
          {capacityAvailable.map((char, index) => (
            <div key={index} className="input-block">
              <label>Capacity
                <input
                  type="text"
                  placeholder="For example -128GB"
                  value={char.key}
                  onChange={(ev) => updateCapacity(index, ev.target.value, char.value)}
                />
              </label>
              <button type="button" className="btn-red" onClick={() => removeCapacity(index)}>
                Видалити
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary my-2 " onClick={addCapacity}>
            Add capacity
          </button>
        </div>

        <label>
          Capacity
          <input
            type="text"
            placeholder="128GB"
            value={capacity}
            onChange={(ev) => setCapacity(ev.target.value)}
          />
        </label>



        <label>
          Категорія товару:
          <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
            <option value="">Виберіть зі списку</option>
            {categories.length > 0 &&
              categories.map((c) => <option value={c._id} key={c}>
                {c.name}
              </option>)}
          </select>
        </label>
      </div>


      {/* {categories.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={""} className="">
            <>{p.name[0].toUpperCase() + p.name.substring(1)}</>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v} key={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))} */}




      <p>Ціна та наявність</p>
      <div className="input-block grid-3">
        {/* Галочка про наявність товару */}

        {/* <textarea
        placeholder="availability"
        value={availability}
        onChange={(ev) => setAvailability(ev.target.value)}
      ></textarea> */}

        <label>
          Price Regular
          <input
            type="number"
            value={priceRegular}
            onChange={(ev) => setPriceRegular(ev.target.value)}
          />
        </label>
        <label>
          Price Discount
          <input
            type="number"
            value={priceDiscount}
            onChange={(ev) => setPriceDiscount(ev.target.value)}
          />
        </label>
        {/* 
        <div className="stock">
          <div className="isOnStock">
            <label>в наявності
              <input type="radio" name="onStock" value={'yes'} />
            </label>
            <label>
              відсутній
              <input type="radio" name="onStock" value={'no'} />
            </label>
            <label>
              в дорозі
              <input type="radio" name="onStock" value={'wait'} />
            </label>
          </div>
        </div> */}
      </div>

      <div>
        <h2>Colors Available</h2>
        {colorsAvailable.map((char, index) => (
          <div key={index} className="input-block">
            <label>Color
              <input
                type="text"
                placeholder="For example - red"
                value={char.key}
                onChange={(ev) => updateColor(index, ev.target.value, char.value)}
              />
            </label>
            <button type="button" className="btn-red" onClick={() => removeColor(index)}>
              Видалити
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary my-2 " onClick={addColor}>
          Add color
        </button>
      </div>

      <label>
        Color
        <input
          type="text"
          value={color}
          onChange={(ev) => setColor(ev.target.value)}
        />
      </label>

      <label>
        Add images
      </label>
      <div className="mb-4 mt-4 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-28 inline-block bg-white p-3 shadow-sm rounded-sm border border-gray "
              >
                <img
                  src={link}
                  alt="Зображення товару"
                  className="rounded-lg"
                />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-28 p-4 flex items-center">
            <Spinner />
          </div>
        )}

        <label
          className=" w-26 h-26
                border text-center flex flex-col
                 items-center justify-center text-primary
                 rounded-sm bg-gray-200 cursor-pointer shadow-md
                 border border-primary
                 "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Додати фото</div>
          <input onChange={uploadImages} type="file" className="hidden" />
        </label>
      </div>

      <div>
        <h2>Description</h2>
        {description.map((desc, index) => (
          <div key={index} className="input-block">
            <label>Title
              <input
                type="text"
                placeholder="Title"
                value={desc.title}
                onChange={(ev) => updateDescription(index, ev.target.value, desc.text)}
              />
            </label>
            <label>Text
              <input
                type="text"
                placeholder="Text"
                value={desc.text}
                onChange={(ev) => updateDescription(index, desc.title, ev.target.value)}
              />
            </label>
            <button type="button" className="btn-red" onClick={() => removeDescription(index)}>
              Видалити
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary my-2 " onClick={addDescription}>
          Add description
        </button>
      </div>

      <p>Екран та його властивості</p>
      <div className="input-block grid-2">
        <label>
          Screen
          <input
            type="text"
            placeholder="6.1' IPS"
            value={screen}
            onChange={(ev) => setScreen(ev.target.value)}
          />
        </label>
        <label>
          Resolution
          <input
            type="text"
            placeholder="1792x828"
            value={resolution}
            onChange={(ev) => setResolution(ev.target.value)}
          />
        </label>
      </div>


      <label>
        Processor
        <input
          type="text"
          placeholder="Apple A13 Bionic"
          value={processor}
          onChange={(ev) => setProcessor(ev.target.value)}
        />
      </label>
      <label>
        Ram
        <input
          type="text"
          placeholder="4GB"
          value={ram}
          onChange={(ev) => setRam(ev.target.value)}
        />
      </label>

      <label>
        Camera
        <input
          type="text"
          placeholder="12 Mp + 12 Mp + 12MP"
          value={camera}
          onChange={(ev) => setCamera(ev.target.value)}
        />
      </label>

      <label>
        Zoom
        <input
          type="text"
          placeholder="Digital, 5x"
          value={zoom}
          onChange={(ev) => setZoom(ev.target.value)}
        />
      </label>


      <div>
        <h2>Cell</h2>
        {cell.map((char, index) => (
          <div key={index} className="input-block">
            <label>Cell
              <input
                type="text"
                placeholder="For example - LTE"
                value={char.key}
                onChange={(ev) => updateCell(index, ev.target.value, char.value)}
              />
            </label>
            <button type="button" className="btn-red" onClick={() => removeCell(index)}>
              Видалити
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-primary my-2 " onClick={addCell}>
          Add cell
        </button>
      </div>

      <label>
        Article
        <input
          type="text"
          placeholder="0x6"
          value={article}
          onChange={(ev) => setArticle(ev.target.value)}
        />
      </label>

      <label>
        Category
        <input
          type="text"
          placeholder="phones"
          value={currentCategory}
          onChange={(ev) => setCurrentCategory(ev.target.value)}
        />
      </label>

      <button type="submit" className="btn-primary my-2">
        Зберегти товар
      </button>
    </form>
  );
}
