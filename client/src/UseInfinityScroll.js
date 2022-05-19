import axios from 'axios'
import { useEffect, useState } from 'react';

const UseInfinityScroll = (url='', params, config) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [docs, setDocs] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  // reset each search changes
  useEffect(() => {
    setDocs([])
  }, [params?.query])

  // search and append
  useEffect(() => {
    setLoading(true);
    setError(false)

    let cancel;
    axios.get(url, {
      params,
      headers:config.headers,
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setDocs(prev => {
        return [...new Set([...prev, ...res.data])]
      })

      setHasMore(res.data.length > 0)
      setLoading(false)
    })
    .catch(e => {

      //ignore if axios cancel error
      if (axios.isCancel(e)) return;

      setError(true)
    })

    // axios({
    //   method: "GET",
    //   url,
    //   params,
    //   headers:config,
    //   cancelToken: new axios.CancelToken(c => cancel = c)
    // })
      

    // useEffect return function
    return () => cancel();
  }, [params?.query, params?.page])

  return {loading, error, docs, hasMore};
}

export default UseInfinityScroll