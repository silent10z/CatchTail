import styles from './searchResult.module.scss'

import useQuerySearch from '../hooks'

import { useInView } from 'react-intersection-observer'
import { useEffect, useRef, UIEvent } from 'react'
import { useMount } from 'react-use'

import Skeleton from '../skeleton'
import ItemBox from 'components/ItemBox'
import store from 'storejs'
import dayjs from 'dayjs'
import NoResult from './noResult'

const SearchResult = () => {
  const content = useRef<HTMLUListElement | null>(null)

  const [ref, inView] = useInView()

  const { data, isLoading, fetchNextPage, isFetching, status } = useQuerySearch()

  useMount(() => {
    if (store.get('ResultScroll')) {
      const yScroll = store.get('ResultScroll').scroll
      const expireTime = store.get('ResultScroll').expire
      if (!dayjs().isAfter(expireTime))
        content.current?.scrollTo({
          top: yScroll,
          behavior: 'auto',
        })
    }
  })

  useEffect(() => {
    if (inView && !isLoading) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView, isLoading])

  const onScroll = (e: UIEvent<HTMLElement>) => {
    store.set('ResultScroll', { scroll: e.currentTarget.scrollTop, expire: dayjs().add(15, 'minute') })
  }

  if (status === 'error') return <NoResult text='에러 입니다 관리자에게 요청하세요.' />
  if (isLoading)
    return (
      <ul className={styles.resultContainer}>
        {new Array(45).fill(1).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={`skeleton-one-${i}`} />
        ))}
      </ul>
    )
  if (data?.pages[0].totalCount === 0) return <NoResult text='검색 결과가 없습니다.' />

  return (
    <div>
      <ul className={styles.resultContainer} onScroll={onScroll} ref={content}>
        {data?.pages.map((page) =>
          page.items.item.map((item) => {
            return <ItemBox item={item} key={item.desertionNo} />
          })
        )}
        {isFetching &&
          new Array(12).fill(1).map((_, i) => {
            // eslint-disable-next-line react/no-array-index-key
            return <Skeleton key={`skeleton-two-${i}`} />
          })}
        {!isLoading && <div style={{ width: '100%', height: '50px' }} ref={ref} />}
      </ul>
    </div>
  )
}
export default SearchResult
