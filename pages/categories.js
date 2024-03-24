import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setparentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);


  useEffect(() => {
    fetchCategories();
  }, [])

  function fetchCategories(ev) {
    axios.get('/api/categories').then(result => {
      setCategories(result.data)
    })
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(',')
      })
      )
    }
    if (editedCategory) {
      data._id = editedCategory._id
      await axios.put('/api/categories', data)
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setparentCategory('');
    setProperties([])
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name)
    setparentCategory(category.parent?._id);
    setProperties(category.properties.map(({ name, values }) => ({
      name,
      values: values.join(',')
    })))
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Ви впевнені?',
      text: `Ви хочете видалити ${category.name}`,
      showCancelButton: true,
      cancelButtonTitle: 'Видалити',
      confirmButtonText: 'Так, видалити',
      reverseButtons: false,
      confirmButtonColor: 'red',
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('api/categories?_id=' + _id);
        fetchCategories();
      }
    })
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties
    })
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties
    })
  }

  function removePropery(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      })
    })
  }

  return (
    <Layout>
      <h1>Категорії</h1>
      <ladel>
        {editedCategory
          ? `Редагування категорії ${editedCategory.name}`
          : 'Назва нової категорії'}
      </ladel>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Назва категорії'}
            onChange={ev => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={ev => setparentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">Не батьківська категорія</option>
            {categories.length > 0 && categories.map(category => (
              <option key={categories} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Властивості</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm mb-2">
            Додати нову властивість
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div key={''} className="flex gap-1 mb-2">
              <input
                type="text"
                className="mb-0"
                value={property.name}
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                placeholder="назва властивості (колір)" />
              <input type="text"
                className="mb-0"
                onChange={ev =>
                  handlePropertyValuesChange(index, property, ev.target.value)}
                value={property.values}
                placeholder="значення, розділені комами" />
              <button
                type="button"
                onClick={() => removePropery(index)}
                className="btn-red">
                Видалити
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null)
                setName('')
                setparentCategory('')
                setProperties([])
              }}
              className="btn-default">
              Скасувати
            </button>)}
          <button
            type="submit"
            className="btn-primary py-1">
            Зберегти
          </button>
        </div>

      </form>
      {editCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Назва категорії</td>
              <td>Батьківська категорія</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr key={''}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1">Редагувати</button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red">Видалити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </Layout>
  )
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
))