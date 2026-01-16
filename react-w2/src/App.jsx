import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const signIn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `anToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
    } catch (error) {
      console.dir(error.response);
      setIsAuth(false);
    }
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const checkSignIn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/user/check`)
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("anToken="))
        ?.split("=")[1];
      axios.defaults.headers.common['Authorization'] = token;
      console.log(res.data);
      getproducts();
    } catch (error) {
      console.log(error.response.data.message);

    }
  }

  const getproducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(res.data.products);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

useEffect(()=>{},[])


  return (

    <>
      {!isAuth ? <div className='container'>
        <div className="row mt-5 justify-content-center">
          <div className="col-md-4">
            <h3 className='text-center mb-4 '>請先登入</h3>
            <form>
              <div className="card shadow-sm p-4">
                <div className="form-group mb-3">
                  <label htmlFor="username">Email</label>
                  <input type="email" className="form-control"
                    id='username' name="username" placeholder='請輸入信箱' value={formData.username}
                    onChange={handleInputChange} />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">密碼</label>
                  <input type="password" className="form-control"
                    id="password" name="password" placeholder='請輸入密碼' value={formData.password}
                    onChange={handleInputChange} />
                </div>
                <button type='button' className='btn btn-info w-100' onClick={signIn}>登入</button>
              </div>
            </form>
          </div>
        </div>
      </div> : <div className='container'>
        <div className="row mt-5 justify-content-center">
          <div className="col-auto text-center ">
            <button type='button' className='btn btn-info px-5' onClick={checkSignIn}>確認是否登入</button>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6">
            <h2 >產品列表</h2>

            <table className='table'>
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>是否啟用</th>
                  <th>查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((products) => {
                  return <tr key={products.id}>
                    <td>{products.title}</td>
                    <td>{products.origin_price}</td>
                    <td>{products.price}</td>
                    <td>{products.is_enabled ? '已啟用' : '未啟用'}</td>
                    <td><button type='button'
                      className='btn btn-info'
                      onClick={() => {
                        setTempProduct(products)
                      }}>查看</button></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h2>商品明細</h2>
            {tempProduct ? <div className="card">
              <img src={tempProduct.imageUrl} className="card-img-top" alt="商品圖片" />
              <div className="card-body">
                <h5 className="card-title">{tempProduct.title}</h5>
                <p className="card-text">商品描述：{tempProduct.category}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <p className="card-text">原價：<del>{tempProduct.origin_price} 元</del> / 售價：{tempProduct.price} 元</p>
                {tempProduct.imagesUrl.map((images, index) => {
                  return <img key={index} src={images} class="card-img-top" style={{
                    width: '50%',
                    height: '250px',
                    objectFit: 'cover'
                  }} alt="更多商品圖片" />
                })}
              </div>
            </div> : '請點選商品以查看更多'}

          </div>
        </div>


      </div>}

    </>
  )
}

export default App
