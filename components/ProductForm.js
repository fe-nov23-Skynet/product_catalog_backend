/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
  // Додано нові колонки для нових даних
  seoTitle: existingSeoTitle,
  seoName: existingSeoName,
  seoContent: existingSeoContent,
  seoKey: existingSeoKey,
  article: existingArticle,
  characteristics: existingCharacteristics,
  availability: existingAvailability,
  dynamicCharacteristics: existingDynamicCharacteristics,
}) {
  // Додано нові колонки для нових даних
  const [seoTitle, setSeoTitle] = useState(existingSeoTitle || "");
  const [seoName, setSeoName] = useState(existingSeoName || "");
  const [seoContent, setSeoContent] = useState(existingSeoContent || "");
  const [seoKey, setSeoKey] = useState(existingSeoKey || "");
  const [article, setArticle] = useState(existingArticle || "");
  const [characteristics, setCharacteristics] = useState(
    existingCharacteristics || ""
  );
  const [dynamicCharacteristics, setDynamicCharacteristics] = useState(existingDynamicCharacteristics || []);

  const [availability, setAvailability] = useState(existingAvailability || "");
  // Додано нові колонки для нових даних
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

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
      title,
      description,
      price,
      images,
      category,
      seoTitle,
      seoName,
      seoContent,
      seoKey,
      article,
      characteristics,
      properties: productProperties,
      availability,
      dynamicCharacteristics,
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
  return (
    <form onSubmit={saveProduct}>
      <div className="input-block grid-2">
        <label>
          Назва товару
          <input
            type="text"
            placeholder="введіть назву товару"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
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

        <div>
          <label>
            Базова ціна
            <input type="number" name="basePrice" />
          </label>
        </div>

        <div>
          <label>
            Ціна зі знижкою
            <input type="number" name="discountPrice" />
          </label>
        </div>

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
        </div>
      </div>

      <p>Екран та його властивості</p>
      <div className="input-block grid-2">
        <div>
          <label>
            Розмір екрану
            <input type="text" name="displaySize" />
          </label>
        </div>
        <div>
          <label>
            Розширення екрану
            <input type="text" name="displayResolution" />
          </label>
        </div>
      </div>

      <p>Камера</p>
      <div className="input-block grid-2">
        <div>
          <label>
            Камера
            <input type="text" name="camera" />
          </label>
        </div>
        <div>
          <label>
            Зум
            <input type="text" name="zoom" />
          </label>
        </div>
      </div>

      <p>Процесор та пам'ять</p>
      <div className="input-block grid-3">
        <div>
          <label>
            Процесор
            <input type="text" name="processor" />
          </label>
        </div>
        <div>
          <label>
            ОЗУ
            <input type="text" name="ram" />
          </label>
          <label>
            Інші варіанти ОЗУ
            <input type="text" name="ramAvailale" />
          </label>
        </div>
        <div>
          <label>
            Об'єм пам'яті
            <input type="text" name="capacity" />
          </label>
          <label>
            Інші варіанти об'єму пам'яті
            <input type="text" name="capacityAvailable" />
          </label>
        </div>
      </div>

      <p>Колір</p>
      <div className="input-block grid-2">
        <div>
          <label>
            Колір виробу
            <input type="text" name="color" />
          </label>
        </div>
        <div>
          <label>
            Доступні кольори
            <input type="text" name="colorAvailable" />
          </label>
        </div>
      </div>

      <label>
        Додати зображення (одне або декілька)
      </label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 inline-block bg-white p-3 shadow-sm rounded-sm border border-gray "
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
          <div className="h-26 p-4 flex items-center">
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

      <br />


      {/* Нові дані для вводу */}
      <p>Мета дані (SEO)</p>
      <div className="input-block">
        <label>
          Введіть ключові слова для SEO оптимізації (слова по котрим пошукові системи будуть просувати Ваш сайт)
          <input
            type="text"
            placeholder="введіть назву товару"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </label>
      </div>
      {/* <ladel>Title</ladel>
      <textarea
        placeholder="title"
        value={seoTitle}
        onChange={(ev) => setSeoTitle(ev.target.value)}
      ></textarea> */}
      {/* <ladel>Name</ladel>
      <textarea
        placeholder="name"
        value={seoName}
        onChange={(ev) => setSeoName(ev.target.value)}
      ></textarea> */}
      {/* <ladel>Content</ladel>
      <textarea
        placeholder="content"
        value={seoContent}
        onChange={(ev) => setSeoContent(ev.target.value)}
      ></textarea> */}
      {/* <ladel>Key</ladel>
      <textarea
        placeholder="key"
        value={seoKey}
        onChange={(ev) => setSeoKey(ev.target.value)}
      ></textarea> */}
      <p>Про товар</p>
      {/* <ladel>Артикул</ladel>
      <textarea
        placeholder="артикул"
        value={article}
        onChange={(ev) => setArticle(ev.target.value)}
      ></textarea>
      <ladel>Характеристики</ladel>
      <textarea
        placeholder="характеристики"
        value={characteristics}
        onChange={(ev) => setCharacteristics(ev.target.value)}
      ></textarea> */}

      <p>Опис товару (тут можна додати масив description: title and text)</p>
      {dynamicCharacteristics.map((char, index) => (
        <div key={index} className="input-block">
          <label>Заголовок
            <input
              type="text"
              placeholder="Ключ"
              value={char.key}
              onChange={(ev) => updateCharacteristic(index, ev.target.value, char.value)}
            />
          </label>
          <label>Текст опису властивості
            <input
              type="text"
              placeholder="Значення"
              value={char.value}
              onChange={(ev) => updateCharacteristic(index, char.key, ev.target.value)}
            />
          </label>
          <button type="button" className="btn-red" onClick={() => removeCharacteristic(index)}>
            Видалити
          </button>
        </div>
      ))}
      <div className="grid-2-sb">
        <button type="button" className="btn btn-primary my-2 " onClick={addCharacteristic}>
          Додати розділ опису
        </button>

        {/* Нові дані для вводу  */}
        {/* <ladel className=" mx-2 " >Опис</ladel> */}
        {/* <textarea
        placeholder="опис"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea> */}

        <button type="submit" className="btn-primary my-2">
          Зберегти товар
        </button>
      </div>
    </form>
  );
}
