/** @format */

import React, { useEffect, useState, useRef } from 'react';
import {
  Checkbox,
  Form,
  Radio,
  Card,
  Button,
  Row,
  Col,
  InputNumber,
  Table,
  Drawer,
  Modal,
  Spin,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { mockData } from './mockdata';

import '@/styles/pages/shoppingcart.less';

const sizeOptions = ['X', 'XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL'];

// const firstImageUrl = '../../assets/img/2.jpg';
// const secondImageUrl = '../../assets/img/3.jpg';

const allCountAtom = atomWithStorage('testCount', 0);
const totalPriceAtom = atomWithStorage('totalPrice', 0);
const shopCartDataAtom = atomWithStorage('shoppingCartData', []);
const ShoppingCart = () => {
  const [testCount, setCount] = useAtom(allCountAtom);
  const [shoppingCartData, setShopCartData] = useAtom(shopCartDataAtom);
  const [totalPrice, setTotalPrice] = useAtom(totalPriceAtom);

  const [form] = Form.useForm();
  const [listData, setListData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [isModalOpenOne, setIsModalOpenOne] = useState(false);
  const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
  const [currentSelectSize, setSelectSize] = useState('XS');
  const [currentSelectShop, setCurrentSelectShop] = useState({});
  const [currentShopSize, setCurrentShopSize] = useState(sizeOptions);
  const [imageMap, setImageMap] = useState({});
  const [spinning, setSpinning] = useState(false);
  const allListData = useRef<any[]>([]);

  // Mock数据
  const getProductInfo = () => {
    const { sort = 'asc' } = form.getFieldsValue();
    const sortFn = sort === 'asc' ? (a, b) => a.price - b.price : (a, b) => b.price - a.price;
    setSpinning(true);
    allListData.current = mockData;
    setTimeout(() => {
      setListData(mockData.sort(sortFn));
      setSpinning(false);
    }, 3000);
  };
  // 选择尺码
  const selectSizeFun = info => {
    setIsModalOpenTwo(true);
    setCurrentShopSize(info.availableSizes);
    setCurrentSelectShop(info);
  };

  const addToShoppingCard = info => {
    // 判断购物车中是否存在
    let isExist = false;
    let total = 0;
    let allCount = 0;
    const newData = shoppingCartData.map((item: any) => {
      if (item.id === `${info.id}_${currentSelectSize}`) {
        total += item.price * (item.count + 1);
        allCount += item.count + 1;
        isExist = true;
        return { ...item, count: item.count + 1 };
      }
      total += item.price * item.count;
      allCount += item.count;
      return { ...item };
    });
    if (!isExist) {
      total += info.price;
      allCount += 1;
      newData.push({
        id: `${info.id}_${currentSelectSize}`,
        title: info.title,
        count: 1,
        size: currentSelectSize,
        price: info.price,
      });
    }
    setCount(allCount);
    setShopCartData(newData as any);
    setTotalPrice(total);
    // dispatch(setShoppingCartData({ data: newData, total, allCount }));
    setVisible(true);
  };

  const onFormChange = (key, newVal) => {
    const formValue = form.getFieldsValue();
    form.setFieldsValue({ ...formValue, [key]: newVal });
    // 尺码排序
    if (key === 'size') {
      const sizeMap = {};
      newVal.forEach(item => {
        sizeMap[item] = true;
      });
      const newListData = allListData.current.filter(item =>
        item.availableSizes.every(size => sizeMap[size]),
      );
      setListData(newListData);
    }
    // 价格排序
    if (key === 'sort') {
      setListData(
        listData
          .slice()
          .sort(newVal === 'asc' ? (a, b) => a.price - b.price : (a, b) => b.price - a.price),
      );
    }
  };
  // 选择尺码弹窗
  const onChange = e => {
    setSelectSize(e.target.value);
  };
  const selectSizeOk = () => {
    addToShoppingCard(currentSelectShop);
    setIsModalOpenTwo(false);
  };
  const showModalOne = () => {
    setIsModalOpenOne(true);
  };

  const handleOk = () => {
    setIsModalOpenOne(false);
  };

  const handleCancel = () => {
    setIsModalOpenOne(false);
    setIsModalOpenTwo(false);
  };
  const getCardInfo = info => (
    <div className="card-info">
      <div className="card-name">{info.title}</div>
      <div className="card-price">{Number(info.price).toFixed(2)}</div>
      <div className="card-size">{(info.availableSizes || []).join(',')}</div>
      <div style={{ marginTop: 8 }}>
        <Button
          onClick={() => {
            selectSizeFun(info);
          }}
        >
          添加到购物车
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    getProductInfo();
    form.setFieldsValue({ size: sizeOptions, sort: 'asc' });
  }, []);

  const tableColumns = [
    {
      title: '商品名称',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '型号',
      dataIndex: 'size',
      key: 'size',
      width: 80,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      width: 80,
      render: (value, record) => (
        <InputNumber
          min={1}
          max={1000}
          value={value}
          onChange={val => {
            let total = 0;
            let count = 0;
            const newShoppingCartData = shoppingCartData.map((item: any) => {
              if (item.id === record.id && item.size === record.size) {
                total += item.price * val;
                count += item.count;
                return { ...item, count: val };
              }
              total += item.price * item.count;
              count += item.count;
              return { ...item };
            });
            setCount(count + 1);
            setShopCartData(newShoppingCartData as any);
            setTotalPrice(total);
            // dispatch(setShoppingCartData({ data: newShoppingCartData, total }));
          }}
        />
      ),
    },
    {
      title: '清空',
      dataIndex: 'ope',
      key: 'ope',
      width: 80,
      render: (_, record) => (
        <DeleteOutlined
          style={{ marginLeft: 16 }}
          onClick={() => {
            let total = 0;
            let count = 0;
            const newShoppingCartData = shoppingCartData.filter((item: any) => {
              if (item.id !== record.id || item.size !== record.size) {
                total += item.price * item.count;
                count += item.count;
              }
              return item.id !== record.id || item.size !== record.size;
            });
            setShopCartData(newShoppingCartData as any);
            setTotalPrice(total);
            setCount(count);
            // dispatch(setShoppingCartData({ data: newShoppingCartData, total }));
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="shopping-cart-header">
        <div>
          <Form form={form}>
            <Form.Item name="size" label="尺寸">
              <Checkbox.Group
                options={sizeOptions.map(item => ({ value: item, label: item }))}
                onChange={val => {
                  onFormChange('size', val);
                }}
              />
            </Form.Item>
            <Form.Item name="sort" label="价格">
              <Radio.Group
                options={[
                  { value: 'asc', label: '按价格升序' },
                  { value: 'desc', label: '按价格降序' },
                ]}
                onChange={e => {
                  onFormChange('sort', e.target.value);
                }}
                optionType="button"
              />
            </Form.Item>
          </Form>
        </div>
        <div
          className="shoping-cart"
          onClick={() => {
            setVisible(true);
          }}
        >
          <div>购物车</div>
          <div>{testCount}</div>
        </div>
      </div>
      <Spin spinning={spinning}>
        <div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {listData.map(item => (
              <Col key={item.id} xs={24} sm={12} md={12} lg={8} xl={6} style={{ marginTop: 12 }}>
                <div className="card-box">
                  <div
                    className="card-img-box"
                    key={item.id}
                    onMouseEnter={() => {
                      setImageMap({ ...imageMap, [item.id]: item.hoverUrl });
                    }}
                    onMouseLeave={() => {
                      setImageMap({ ...imageMap, [item.id]: item.img });
                    }}
                  >
                    <img src={imageMap[item.id] || item.img} alt={item.title} />
                  </div>
                  <div>{getCardInfo(item)}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Spin>
      <Drawer
        title="购物车"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width="50%"
        footer={null}
      >
        <Table
          columns={tableColumns}
          dataSource={shoppingCartData}
          size="small"
          rowKey={record => `${record.id}-${record.size}`}
          pagination={false}
        />
        <h1>总价格：{Number(totalPrice).toFixed(2)}</h1>
        <h1>总数量：{testCount}</h1>
        <Button onClick={showModalOne} style={{ float: 'right' }}>
          结算
        </Button>
      </Drawer>
      <Modal title="结账" open={isModalOpenOne} onOk={() => handleOk()} onCancel={handleCancel}>
        <p>一共{Number(totalPrice).toFixed(2)}，确认支付吗</p>
      </Modal>
      <Modal
        title="选择尺码"
        open={isModalOpenTwo}
        onOk={() => selectSizeOk()}
        onCancel={handleCancel}
      >
        <Radio.Group onChange={onChange} value={currentSelectSize}>
          {currentShopSize.map(item => (
            <Radio key={item} value={item}>
              {item}
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </>
  );
};

export default ShoppingCart;
