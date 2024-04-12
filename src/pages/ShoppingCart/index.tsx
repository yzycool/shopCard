/** @format */

import React, { useEffect, useState, useRef } from 'react';
import { Checkbox, Form, Radio, Card, Button, Row, Col, InputNumber, Table, Drawer } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setShoppingCartData, getShoppingCartData, getTotalPrice } from '@/store/shoppingCartSlice';
import { mockData } from './mockdata';

import '@/styles/pages/shoppingcart.less';

const { Meta } = Card;

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XLL'];

const ShoppingCart = () => {
  const shoppingCartData = useAppSelector(getShoppingCartData);
  const totalPrice = useAppSelector(getTotalPrice);

  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [listData, setListData] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const allListData = useRef<any[]>([]);

  // 自己Mock下数据
  const getProductInfo = () => {
    const { sort = 'asc' } = form.getFieldsValue();
    console.log(sort);
    const sortFn = sort === 'asc' ? (a, b) => a.price - b.price : (a, b) => b.price - a.price;
    setListData(mockData.sort(sortFn));
    allListData.current = mockData;
  };

  const addToShoppingCard = info => {
    // 判断购物车中是否存在
    let isExist = false;
    let total = 0;
    const newData = shoppingCartData.map(item => {
      total += item.price * (item.count + 1);
      if (item.id === info.id) {
        isExist = true;
        return { ...item, count: item.count + 1 };
      }
      return { ...item };
    });
    if (!isExist) {
      // TODO size的处理没做  自己做下
      total += info.price;
      newData.push({ id: info.id, title: info.title, count: 1, size: 'XXL', price: info.price });
    }
    dispatch(setShoppingCartData({ data: newData, total }));
    setVisible(true);
  };

  const onFormChange = (key, newVal) => {
    const formValue = form.getFieldsValue();
    form.setFieldsValue({ ...formValue, [key]: newVal });
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
    if (key === 'sort') {
      // TODO 没生效
      console.log(newVal);
      setListData(
        listData.sort(newVal === 'asc' ? (a, b) => a.price - b.price : (a, b) => b.price - a.price),
      );
    }
  };

  const getCardInfo = info => (
    <div className="card-info">
      <div className="card-name">{info.title}</div>
      <div className="card-price">{info.price}</div>
      <div className="card-size">{(info.availableSizes || []).join(',')}</div>
      <div>{info.description || ''}</div>
      <div style={{ marginTop: 8 }}>
        <Button
          onClick={() => {
            addToShoppingCard(info);
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
            const newShoppingCartData = shoppingCartData.map(item => {
              if (item.id === record.id) {
                total += item.price * val;
                return { ...item, count: val };
              }
              total += item.price * item.count;
              return { ...item };
            });
            dispatch(setShoppingCartData({ data: newShoppingCartData, total }));
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
        <Button
          danger
          onClick={() => {
            let total = 0;
            const newShoppingCartData = shoppingCartData.filter(item => {
              if (item.id !== record.id) {
                total += item.price * item.count;
              }
              return item.id !== record.id;
            });
            dispatch(setShoppingCartData({ data: newShoppingCartData, total }));
          }}
        >
          <DeleteOutlined /> 删除
        </Button>
      ),
    },
  ];

  return (
    <>
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
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {listData.map(item => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} style={{ marginTop: 12 }}>
              <Card
                hoverable
                key={item.id}
                cover={
                  <img
                    alt={item.title}
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <Meta title={getCardInfo(item)} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
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
          rowKey="id"
          pagination={false}
        />
        <h1>总价格：{totalPrice}</h1>
      </Drawer>
    </>
  );
};

export default ShoppingCart;
