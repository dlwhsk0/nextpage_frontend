import React from 'react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface StoryModalProps {
  rootId: {
    rootId: number
    page: number
  }
  isOpen: boolean
  onClose: () => void
  handleClickStory: (rootId: number, page: number) => void
  isCreateModalOpen: boolean
}

const StoryModal: React.FC<StoryModalProps> = ({
  rootId,
  isOpen,
  onClose,
  handleClickStory,
  isCreateModalOpen,
}) => {
  const [story, setStory] = useState<{
    user_nickname: string
    content: string
    image_url: string
    child_id: number[]
    child_content: string[]
  } | null>(null)
  const modalRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]
  const [isAnimationComplete1, setIsAnimationComplete1] = useState(false)
  const [isAnimationComplete2, setIsAnimationComplete2] = useState(false)
  const [nextModalKey, setNextModalKey] = useState(0)

  const handleBackgroundClick = (e: MouseEvent) => {
    // 모달 외부를 클릭했을 때 모달을 닫도록 하는 이벤트 처리
    if (
      modalRefs.every(
        (modalRef) => !modalRef.current?.contains(e.target as Node),
      ) &&
      isOpen
    ) {
      if (!isCreateModalOpen) {
        onClose()
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 외부 클릭 이벤트 리스너 등록
      document.addEventListener('mousedown', handleBackgroundClick)
    } else {
      // 모달이 닫힐 때 외부 클릭 이벤트 리스너 제거
      document.removeEventListener('mousedown', handleBackgroundClick)
    }
    // 컴포넌트 언마운트 시에 이벤트 리스너 정리
    return () => {
      document.removeEventListener('mousedown', handleBackgroundClick)
    }
  }, [isOpen, isCreateModalOpen])

  useEffect(() => {
    console.log('**story_id: ', rootId)
    const storyAPI = async () => {
      try {
        const response = await axios.get(`/api/v1/stories/${rootId.rootId}/`)
        console.log('response: ', response.data.data)
        if (response.data.data) {
          // 데이터가 존재할 때만 state 업데이트
          setStory({
            user_nickname: response.data.data.user_nickname,
            content: response.data.data.content,
            image_url: response.data.data.image_url,
            child_id: response.data.data.child_id,
            child_content: response.data.data.child_content,
          })
        }
      } catch (error) {
        console.error('Error fetching story data:', error)
      }
    }

    storyAPI()
  }, [rootId, nextModalKey])

  return (
    <div
      className={`flex justify-center items-center fixed top-0 left-0 w-[100vw] h-[100vh] bg-black bg-opacity-50 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="flex gap-[100px] z-20">
        <motion.div
          ref={modalRefs[0]}
          key={`story-modal-${nextModalKey}`}
          className={`flex flex-col w-[420px] h-[670px] z-1`}
          initial={{
            opacity: isCreateModalOpen ? 1 : 0,
            scale: 1,
            y: isCreateModalOpen ? 0 : 80,
            rotateY: isCreateModalOpen ? 0 : 500,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateY: 0,
            transition: isCreateModalOpen
              ? {}
              : {
                  rotateY: {
                    duration: 1,
                  },
                  y: {
                    type: 'spring',
                    damping: 3,
                    stiffness: 50,
                    restDelta: 0.01,
                    duration: 0.3,
                  },
                },
          }}
          transition={{ duration: 1 }}
        >
          <div className="relative flex gap-[15px] w-full h-[55px] justify-center items-center pt-[8px] bg-blue-800 border-2 border-b-0 border-gray-400 text-green-400 text-[33px] font-Minecraft">
            <span>
              PAGE <span className="text-white">{rootId.page}</span>{' '}
            </span>
            <div className="text-gray-400 text-[14px] absolute bottom-[8px] right-[32px]">
              @ {story?.user_nickname ? `${story.user_nickname}` : 'LOADING...'}
            </div>
          </div>
          <div className="flex flex-col w-full h-[615px] justify-center items-center gap-[16px] bg-[#000000ae] text-white border-2 border-gray-400 ">
            <img
              className="block w-[350px] bg-gray-500"
              style={{
                filter: 'drop-shadow(0px 0px 6px rgba(255, 255, 255, 0.615))',
              }}
              src={story?.image_url ? `${story.image_url}` : ''}
              alt="Image"
            />
            <div className="flex flex-col items-center w-[330px] gap-[10px]">
              <div className="w-[350px] h-[155px] p-[10px] border-dashed border-2 border-gray-500 bg-black">
                {story?.content ? `${story.content}` : 'LOADING...'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex w-[60px] h-[30px] justify-center items-center bg-zinc-300 border-2 border-gray-500 font-Minecraft font-bold text-black text-[20px] hover:bg-blue-600 hover:text-green-400 hover:shadow-blue-600"
            >
              <p className="pt-[4px]">OK</p>
            </button>
          </div>
        </motion.div>
        <div className="flex flex-col justify-center gap-[80px] z-1">
          {/* NEXT Story Modal1 */}
          {story?.child_id && story.child_id[0] !== -1 && (
            <motion.div
              onClick={() => {
                if (isAnimationComplete1) {
                  // 애니메이션이 완료된 상태에서만 클릭 이벤트 처리
                  setIsAnimationComplete1(false)
                  handleClickStory(
                    story?.child_id && story.child_id[0]
                      ? story.child_id[0]
                      : -1,
                    rootId.page + 1,
                  )
                  setNextModalKey((prevKey) => prevKey + 1)
                }
              }}
              className={`flex gap-[40px]`}
              style={{
                opacity: isCreateModalOpen ? 0 : 1,
              }}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{
                opacity: isAnimationComplete1 && !isCreateModalOpen ? 1 : 0,
                scale: isAnimationComplete1 ? 1 : 1.2,
              }}
              whileHover={{ scale: 1.1, transition: { duration: 0.4 } }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => {
                setIsAnimationComplete1(true)
              }}
            >
              <img className="w-[60px] h-[60px]" src="/asset/hand.svg" alt="" />
              <div
                ref={modalRefs[1]}
                className="flex flex-col w-[370px] h-[235px] z-1"
              >
                <div className="flex gap-[15px] w-full h-[40px] justify-center items-center pt-[8px] bg-blue-800 border-2 border-b-0 border-gray-400 text-green-400 hover:bg-green-400 hover:text-blue-800 text-[23px] font-Minecraft">
                  NEXT
                </div>
                <div className="flex flex-col w-full h-[220px] justify-center items-center bg-[#000000ae] text-white border-2 border-gray-400 ">
                  <div className="w-[330px] h-[155px] p-[10px] border-dashed border-2 bg-black border-gray-500">
                    {story?.child_content && story.child_content[0] ? (
                      <p>{story.child_content[0]}</p>
                    ) : (
                      <span className="flex justify-center leading-[8rem] text-gray-400 hover:text-white hover:scale-110">
                        새로운 이야기를 만들어보세요 !
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* NEXT Story Modal2 */}
          <motion.div
            onClick={() => {
              if (isAnimationComplete2) {
                handleClickStory(
                  story?.child_id && story.child_id[1] ? story.child_id[1] : -1,
                  rootId.page + 1,
                )
                setNextModalKey((prevKey) => prevKey + 1)
              }
            }}
            className={`flex gap-[40px]`}
            style={{
              opacity: isCreateModalOpen ? 0 : 1,
            }}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{
              opacity: isAnimationComplete2 && !isCreateModalOpen ? 1 : 0,
              scale: isAnimationComplete2 ? 1 : 1.2,
            }}
            whileHover={{ scale: 1.1, transition: { duration: 0.4 } }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => {
              setIsAnimationComplete2(true)
            }}
          >
            <img className="w-[60px] h-[60px]" src="/asset/hand.svg" alt="" />
            <div
              ref={modalRefs[2]}
              className="flex flex-col w-[370px] h-[235px] z-1"
            >
              <div className="flex gap-[15px] w-full h-[40px] justify-center items-center pt-[8px] bg-blue-800 border-2 border-b-0 border-gray-400 text-green-400 hover:bg-green-400 hover:text-blue-800 text-[23px] font-Minecraft">
                NEXT
              </div>
              <div className="flex flex-col w-full h-[220px] justify-center items-center bg-[#000000ae] text-white border-2 border-gray-400 ">
                <div className="w-[330px] h-[155px] p-[10px] border-dashed border-2 border-gray-500 bg-black hover:text-white ">
                  {story?.child_content && story.child_content[1] ? (
                    <p>{story.child_content[1]}</p>
                  ) : (
                    <span className="flex justify-center leading-[8rem] text-gray-400 hover:text-white hover:scale-110">
                      새로운 이야기를 만들어보세요 !
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StoryModal
