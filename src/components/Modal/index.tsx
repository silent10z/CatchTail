import { useMemo, useRef } from 'react'
import { useClickAway } from 'react-use'
import styles from './modal.module.scss'

import Button from 'components/Button'
import { Item } from 'types'
import { useRecoilState } from 'recoil'
import { bookMarkListState } from 'states'
import _ from 'lodash'
import store from 'storejs'

interface Props {
  setIsOpenPopup: Function
  info: Item
}

const Modal = ({ setIsOpenPopup, info }: Props) => {
  const outsideRef = useRef<HTMLInputElement>(null)
  const [BookmarkList, setBookmarkList] = useRecoilState(bookMarkListState)

  const handleCloseButtonClick = () => {
    setIsOpenPopup(false)
  }

  useClickAway(outsideRef, () => {
    setIsOpenPopup(false)
  })

  const onClickBookmarkAddHandle = () => {
    setBookmarkList((pre) => {
      return pre.concat(info)
    })
    store.set('BookmarkList', BookmarkList.concat(info))
  }

  const onClickBookMarkRemoveHandle = () => {
    const newFavorites = BookmarkList.filter((item) => item.desertionNo !== info.desertionNo)
    setBookmarkList(newFavorites)
    store.remove('BookmarkList')
    store.set('BookmarkList', newFavorites)
  }

  const isBookMark = useMemo(() => {
    return _.findIndex(BookmarkList, { desertionNo: info.desertionNo }) !== -1
  }, [BookmarkList, info.desertionNo])
  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer} ref={outsideRef}>
        <header>
          <div>자세히 보기</div>
          <div>도움이 필요해요!</div>
          <button type='button' onClick={handleCloseButtonClick}>
            close
          </button>
        </header>
        <div className={styles.imgContainer}>
          <img src={info.popfile.replace('http', 'https')} alt='유기동물 사진' />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.rightWapper}>
            <dl>
              <div>
                <dt>나이:</dt>
                <dd>{info.age}</dd>
              </div>
              <div>
                <dt>성별:</dt>
                <dd>{info.sexCd === 'M' ? '수컷' : '암컷'}</dd>
              </div>
              <div>
                <dt>상태:</dt>
                <dd>{info.processState}</dd>
              </div>
              <div>
                <dt>몸무게:</dt>
                <dd>{info.weight}</dd>
              </div>
              <div>
                <dt>종:</dt>
                <dd>{info.kindCd}</dd>
              </div>
              <div>
                <dt>특징:</dt>
                <dd>{info.specialMark}</dd>
              </div>
            </dl>
          </div>
          <div className={styles.leftWapper}>
            <div>
              <dt>발견일:</dt>
              <dd>{info.happenDt}</dd>
            </div>
            <div>
              <dt>구조위치:</dt>
              <dd>{info.noticeNo}</dd>
            </div>
            <div>
              <dt>보호소:</dt>
              <dd>{info.careNm}</dd>
            </div>
            <div>
              <dt>보호소 번호:</dt>
              <dd>{info.careTel}</dd>
            </div>
            <div>
              <dt>보호소 주소:</dt>
              <dd>{info.careAddr}</dd>
            </div>
            <div>
              <dt>담당 보호사:</dt>
              <dd>{info.chargeNm}</dd>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {isBookMark ? (
            <Button size='large' onClick={onClickBookMarkRemoveHandle}>
              친구 목록에서 제거
            </Button>
          ) : (
            <Button size='large' onClick={onClickBookmarkAddHandle}>
              친구 목록에 담기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
