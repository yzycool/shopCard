/** @format */

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'lazysizes';
import fetchData from '@/utils/fetch-utils.js';
import UserSvg from '@/assets/user.svg';
import '@/styles/pages/popular.less';

const baseUrl = 'https://api.github.com/search';
const category = ['All', 'Javascript', 'Ruby', 'Java', 'Css', 'Python'];

const dataCache = {};
const pageCache = {};
category.forEach(item => {
  dataCache[item] = [];
  pageCache[item] = 0;
});

const addParameter = parameterValue => {
  const currentUrl = window.location.pathname;
  const parameterName = 'technologyType';
  const separator = currentUrl.includes('?') ? '&' : '?';
  const newUrl = `${currentUrl + separator + parameterName}=${encodeURIComponent(parameterValue)}`;
  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, '', newUrl);
};

// eslint-disable-next-line react/prop-types
const NewsNav = ({ listenUrlChange, currentType }) => {
  const handleItemClick = index => {
    listenUrlChange(index);
    addParameter(index);
  };

  return (
    <div className="news-nav">
      {category.map(item => (
        <span
          key={item}
          className={`news-nav-item ${currentType === item ? 'active' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const NewsList = ({ currentData, columnWidth }) => {
  const goDetail = url => {
    window.open(url);
  };

  return (
    <div className="news-list">
      {(currentData || []).map((news, index) => (
        <div
          key={news.name}
          className="news-item "
          onClick={() => goDetail(news.html_url)}
          style={{ flex: `0 0 calc(${columnWidth} - 16px)` }}
        >
          <div className="news-item-content" style={{ width: '100%' }}>
            <div className="news-item-index">#{index + 1}</div>
            <div className="img-box">
              <img className="lazyload" data-src={`${news.owner.avatar_url}`} alt={news.title} />
            </div>
            <div className="news-item-title text-restriction">{news.name}</div>
            <div className="user-info-box">
              <svg width="21" height="21">
                <image href={UserSvg} width="21" height="21" />
              </svg>

              <div className="news-text text-restriction">{news.name} </div>
            </div>
            <div className="user-info-box">
              <svg width="21" height="21">
                <image href={UserSvg} width="21" height="21" />
              </svg>
              <div className="news-text">{news.stargazers_count} stars</div>
            </div>
            <div className="user-info-box">
              <svg width="21" height="21">
                <image href={UserSvg} width="21" height="21" />
              </svg>
              <div className="news-text">{news.forks_count}forks</div>
            </div>
            <div className="user-info-box">
              <svg width="21" height="21">
                <image href={UserSvg} width="21" height="21" />
              </svg>
              <div className="news-text">{news.open_issues_count}open issues</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PopularPage = () => {
  const url = {
    All: '/repositories?q=stars:>1000',
    Javascript: '/repositories?q=language:javascript+stars:>100',
    Ruby: '/repositories?q=language:ruby+stars:>100',
    Java: '/repositories?q=language:java+stars:>100',
    Css: '/repositories?q=language:css+stars:>100',
    Python: '/repositories?q=language:python+stars:>100',
  };

  const [search] = useSearchParams();
  const [allData, setAllData] = useState(dataCache);
  const [allPage, setAllPage] = useState(pageCache);
  const [currentType, setCurrentType] = useState('All');
  const [columnWidth, setColumnWidth] = useState('25%');
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLock = useRef(false);

  const fetchDataFun = async (pageNum = curPage, type = currentType) => {
    // 判断缓存中是否存在数据
    if (!hasMore) return;
    if (isLock.current) {
      return;
    }
    const hasData = allPage[type] >= pageNum;
    if (hasData) return;

    isLock.current = true;
    try {
      setLoading(true);
      const response = await fetchData(baseUrl, `${url[type]}&per_page=10&page=${pageNum}`);
      const newData = allData[type].concat(response.items);
      const newAllData = {
        ...allData,
        [type]: newData,
      };
      const newAllPage = {
        ...allPage,
        [type]: pageNum,
      };
      setAllData(newAllData);
      setAllPage(newAllPage);
      setLoading(false);
      isLock.current = false;
      if (response.items.length !== 10) {
        setHasMore(false);
      }
    } catch (error) {
      isLock.current = false;
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const listenUrlChange = newType => {
    setCurrentType(newType);
    setCurPage(1);
    fetchDataFun(1, newType);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        setColumnWidth('50%');
      } else if (window.matchMedia('(max-width: 1450px)').matches) {
        setColumnWidth('33.3%');
      } else {
        setColumnWidth('25%');
      }
    };
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    // 初始化一次
    handleResize();
    // 清除监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkScrollBottom = () => {
    // 滚动条在Y轴上的总滚动高度
    const totalScroll = window.scrollY;
    // 窗口的可视高度
    const windowHeight = window.innerHeight;
    // 整个文档的高度
    const docHeight = document.documentElement.scrollHeight;
    if (totalScroll + windowHeight + 1 >= docHeight) {
      fetchDataFun(curPage + 1);
      setCurPage(curPage + 1);
    }
  };

  useEffect(() => {
    // 添加滚动事件监听器
    window.addEventListener('scroll', checkScrollBottom);
    return () => window.removeEventListener('scroll', checkScrollBottom);
  }, [allData, hasMore, curPage]);

  useEffect(() => {
    const urlType = search.get('technologyType') || 'All';
    if (urlType !== currentType) {
      setCurrentType(urlType);
    }
    fetchDataFun(1, urlType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="web-title">github 热门站</div>

      <div className="news-container">
        <NewsNav listenUrlChange={listenUrlChange} currentType={currentType} />
        <NewsList currentData={allData[currentType]} columnWidth={columnWidth} />
      </div>

      {loading && <div className="loading">Loading...</div>}
      {!loading && !hasMore && <div className="loading">No more data~</div>}
    </div>
  );
};

export default PopularPage;
