import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Image {
  id: number
  userNickname: string
  content: string
  imageUrl: string
}

const CarouselContainer: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const cellCount: number = 7
  const [images, setImages] = useState<Image[]>([])// 이미지 URL을 저장할 상태
  const [content, setContent] = useState<string>('')
  const [userNickname, setUserNickname] = useState<string>('')

  const rotateCarousel = () => {
    if (carouselRef.current) {
      const angle: number = (selectedIndex / cellCount) * -360
      carouselRef.current.style.transform = `translateZ(-88px) rotateY(${angle}deg) rotateX(345deg)`
    }
  }

  const handlePrevButtonClick = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    ) // 인덱스가 음수가 되지 않도록 처리
    rotateCarousel()
  }

  const handleNextButtonClick = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length) // 인덱스가 배열 길이를 초과하지 않도록 처리
    rotateCarousel()
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const storyId = searchParams.get('storyId')
    console.log(storyId)

    const showBranch = async () => {
      try {
        const response = await axios.get(`/api/v2/stories/branch/${storyId}`)
        console.log(response.data.data)
        const imageUrlArray = response.data.data.map((item: any) => ({
          id: item.id,
          content: item.content,
          imageUrl: item.imageUrl,
          userNickname: item.userNickname,
        }))
        setImages(imageUrlArray)
      } catch (error) {
        console.error('Error fetching story data:', error)
      }
    }
    showBranch()
  }, [])

  useEffect(() => {
    if (images.length > 0) {
      // 이미지가 변경될 때마다 해당 이미지의 content를 설정
      setContent(images[selectedIndex]?.content || '')
      setUserNickname(images[selectedIndex]?.userNickname || '')
    }
    rotateCarousel()
  }, [selectedIndex, images])

  return (
    <>
      <div className="flex flex-col items-center h-[145px]">
        <hr className="border-white w-[600px] " />
        <div className="flex items-center justify-between gap-[50px] px-[30px] py-[10px]">
          <div className="text-[20px] text-white">
            <span className="text-green-400">
              {/* {stories[currentStoryIndex]?.userNickname} */}
              {/* {images} */}
              {userNickname}
            </span>
          </div>
          <div className="w-[400px] text-[20px] text-white">
            {/* {stories[currentStoryIndex]?.content} */}
            {/* {images} */}
            {content}
          </div>
        </div>
        <hr className="border-white w-[600px]" />
      </div>
      <div className="scene mt-[30px] mb-[40px] relative w-[230px] h-[160px] mx-auto perspective-[1000px]">
        <div
          ref={carouselRef}
          className="carousel w-full h-full absolute transition-transform duration-1000"
          style={{
            transform: 'translateZ(-88px) rotateX(345deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="carousel__cell w-[210px] h-[140px] absolute left-[10px] top-[10px] border-[2px] border-black text-white text-center transition-transform-opacity duration-1000 rotate-y-${index * 40} translate-z-288`}"
              style={{
                transform: `rotateY(${(360 / cellCount) * index}deg) translateZ(288px)`,
              }}
            >
              <img
                className="transition-opacity"
                src={image.imageUrl} // 이미지 URL을 사용하여 이미지를 렌더링
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* <div className="carousel-options flex gap-[10px] text-center relative z-10 bg-opacity-80 bg-white"> */}
      {/* <p>
          <label className="inline-block">
            Cells
            <input
              className="cells-range"
              type="range"
              min="3"
              max="15"
              defaultValue="9"
            />
          </label>
        </p> */}
      <div className="flex justify-center gap-[80px] w-full h-[30px] mt-[90px] relative z-10 text-center text-[20px] bg-opacity-80">
        <button
          className="previous-button inline-block w-[110px] text-center text-white border-gray-400 border-[2px] bg-blue-600"
          onClick={handlePrevButtonClick}
        >
          Previous
        </button>
        <button
          className="next-button inline-block w-[110px] text-center text-white border-gray-400 border-[2px] bg-blue-600"
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </div>
      {/* <p>
          Orientation:
          <label className="inline-block">
            <input
              type="radio"
              name="orientation"
              value="horizontal"
              defaultChecked
            />
            horizontal
          </label>
          <label className="inline-block">
            <input type="radio" name="orientation" value="vertical" />
            vertical
          </label>
        </p> */}
      {/* </div> */}
    </>
  )
}

export default CarouselContainer
