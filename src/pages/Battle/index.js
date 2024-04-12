/** @format */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchData from '@/utils/fetch-utils.js';
import '@/styles/pages/battle.less';

function Battle() {
  const baseUrl = `https://api.github.com/users`;
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const [showInput1, setShowInput1] = useState(true);
  const [showInput2, setShowInput2] = useState(true);
  const [userInfo1, setUserInfo1] = useState(null);
  const [userInfo2, setUserInfo2] = useState(null);
  const navigate = useNavigate();
  const handleInput1Change = event => {
    setInput1(event.target.value);
  };

  const handleInput2Change = event => {
    setInput2(event.target.value);
  };

  const handleSubmit1 = async () => {
    const response = await fetchData(baseUrl, `/${input1}`);
    setUserInfo1(response);
    setShowInput1(false);
  };

  const handleSubmit2 = async () => {
    const response = await fetchData(baseUrl, `/${input2}`);
    setUserInfo2(response);
    setShowInput2(false);
  };

  const handleCloseInfo1 = () => {
    setUserInfo1(null);
    setShowInput1(true);
  };

  const handleCloseInfo2 = () => {
    setUserInfo2(null);
    setShowInput2(true);
  };
  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      // 在这里处理回车事件
      if (index === 1) {
        handleSubmit1();
      } else {
        handleSubmit2();
      }
    }
  };
  const handleBattle = () => {
    setShowInput1(true);
    setShowInput2(true);
    setInput1('');
    setInput2('');
    navigate(`/battleResult?personOne=${input1}&personTwo=${input2}`);
  };
  return (
    <div className="battle-box">
      <h1>操作流程</h1>
      <div className="battle-process">
        <div>第一步：输入用户名称，点击提交按钮，获取用户基本信息</div>
        <div>第二步：当两个用户信息都获取了，会出现battle按钮，按下battle按钮</div>
        <div>第三步：按下battle按钮后，会跳转到查看结果页面</div>
      </div>
      <div className="battle-operate">
        <div className="battle-input-box">
          <div className="person-num">Player One</div>
          {showInput1 && (
            <div className="input-btn-box">
              <input
                type="text"
                value={input1}
                onChange={handleInput1Change}
                onKeyDown={event => handleKeyDown(event, 1)}
              />
              <button
                onClick={handleSubmit1}
                disabled={!input1.trim()}
                style={{ border: 'none' }}
                type="button"
              >
                提交1
              </button>
            </div>
          )}
          {userInfo1 && (
            <div className="show-user-box">
              <div className="show-user-box-left">
                <img src={userInfo1?.avatar_url} alt="" />
                <p>{userInfo1?.login}</p>
              </div>
              <button type="button" onClick={handleCloseInfo1}>
                关闭1
              </button>
            </div>
          )}
        </div>
        <div className="battle-input-box">
          <div className="person-num">Player Two</div>
          {showInput2 && (
            <div className="input-btn-box">
              <input
                type="text"
                value={input2}
                onChange={handleInput2Change}
                onKeyDown={event => handleKeyDown(event, 2)}
              />
              <button
                onClick={handleSubmit2}
                disabled={!input2.trim()}
                style={{ border: 'none' }}
                type="button"
              >
                提交2
              </button>
            </div>
          )}
          {userInfo2 && (
            <div className="show-user-box">
              <div className="show-user-box-left">
                <img src={userInfo2.avatar_url} alt="" />
                <p>{userInfo2.login}</p>
              </div>
              <button onClick={handleCloseInfo2} type="button">
                关闭2
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="battle-button">
        {!showInput1 && !showInput2 && (
          <div>
            <button onClick={handleBattle} type="button">
              battle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Battle;
