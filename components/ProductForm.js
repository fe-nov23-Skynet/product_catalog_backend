import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs"

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties  || {})
    const [price, setPrice] = useState(existingPrice || ''); 
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || [])
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([]);
    const router = useRouter()
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price, images, category, 
            properties: productProperties 
        };
        if (_id) {
            // update
            await axios.put('/api/products', { ...data, _id });
        } else {
            // create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);

    }
    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties)
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            catInfo = parentCat;
        }
    };


    return (
        <form onSubmit={saveProduct}>
            <ladel>Назва товару</ladel>
            <input
                type="text"
                placeholder="назва товару"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <ladel>Категорія</ladel>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="">Відсутня категорія</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            {categories.length > 0 && propertiesToFill.map(p => (
                <div key={''} className="">
                    <>{p.name[0].toUpperCase()+p.name.substring(1)}</>
                    <div>
                        <select 
                        value={productProperties[p.name]} 
                    onChange={ev => setProductProp(p.name, ev.target.value )}>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                    </div>
                </div>
            ))}
            <ladel>Зображення</ladel>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                    className="flex flex-wrap gap-1"
                    list={images}
                    setList={updateImagesOrder}
                >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 inline-block bg-white p-3 shadow-sm rounded-sm border border-gray ">
                            <img 
                                src={link} 
                                alt="Зображення товару" 
                                className="rounded-lg" 
                            />
                        </div>
                        )
                      )
                    }
                </ReactSortable>
                {isUploading && (
                    <div className="h-26 p-4 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className=" w-26 h-26 
                border text-center flex flex-col 
                 items-center justify-center text-primary 
                 rounded-sm bg-gray-200 cursor-pointer shadow-md
                 border border-primary
                 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Додати фото
                    </div>
                    <input onChange={uploadImages} type="file" className="hidden" />
                </label>
            </div>
            <ladel>Опис</ladel>
            <textarea
                placeholder="опис"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            ></textarea>
            <ladel>Ціна</ladel>
            <input
                type="number"
                placeholder="ціна"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button
                type="submit"
                className="btn-primary">Зберегти</button>
        </form>
    )
}