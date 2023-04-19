import React, { useContext, useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Link } from "react-router-dom";

// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper";

// import { motion } from "framer-motion";

// icons


import { IoEllipsisHorizontalSharp as PostMenuIcon } from "react-icons/io5";
import { AiOutlineSmile as SmileIcon } from "react-icons/ai";
import { GoChevronRight as NextIcon } from "react-icons/go";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { BsHandThumbsUp as HandIcon } from "react-icons/bs";
import { BsHandThumbsUpFill as HandFillIcon } from "react-icons/bs";
import { BsChatSquareDots as CommentIcon } from "react-icons/bs";
import { BsShare as ShareIcon } from "react-icons/bs";
import { AiOutlineThunderbolt as PropuestIcon } from "react-icons/ai";
import {AiFillThunderbolt as PropuestFillIcon} from "react-icons/ai";

import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";

const HomePostCard = ({ post }) => {
  const [commentInput, setCommentInput] = useState("");
  const [commentsArr, setCommentsArr] = useState([]);
  const [limitNum, setLimitNum] = useState(2);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useContext(AuthContext);
  const swiper = useSwiper();

  const likePost = async () => {
    const postRef = doc(firestore, `posts/${post?.id}`);
    updateDoc(
      postRef,
      {
        likedBy: arrayUnion(user?.uid),
      },
      { merge: true }
    );
    setLiked(true);
  };

  const unlikePost = async () => {
    const postRef = doc(firestore, `posts/${post?.id}`);
    updateDoc(
      postRef,
      {
        likedBy: arrayRemove(user?.uid),
      },
      {
        merge: true,
      }
    );
    setLiked(false);
  };

  const savePost = async () => {
    console.log(user.uid, post.id);
    const userRef = doc(firestore, `user/${user.uid}`);
    const postRef = doc(firestore, `posts/${post.id}`);
    updateDoc(
      postRef,
      {
        savedBy: arrayUnion(user.uid),
      },
      { merge: true }
    );
    updateDoc(
      userRef,
      {
        savedPost: arrayUnion(post?.id),
      },
      { merge: true }
    );
    setSaved(true);
  };

  const unsavePost = async () => {
    const userRef = doc(firestore, `user/${user.uid}`);
    const postRef = doc(firestore, `posts/${post.id}`);
    updateDoc(
      postRef,
      {
        savedBy: arrayRemove(user.uid),
      },
      { merge: true }
    );
    updateDoc(
      userRef,
      {
        savedPost: arrayRemove(post?.id),
      },
      { merge: true }
    );
    setSaved(false);
  };

  const commentSubmit = (e) => {
    e.preventDefault();
    // console.log(post?.id, post);
    const commentsCollectionRef = collection(
      firestore,
      `posts/${post?.id}/commentsCollection`
    );
    const commentData = {
      userId: user?.uid,
      comment: commentInput.trim(),
      commentedAt: serverTimestamp(),
      username: user?.username,
      isVerified: user?.isVerified,
      fullName: user?.displayName,
      photoURL: user?.photoURL,
      likes: 0,
    };
    addDoc(commentsCollectionRef, commentData);
    setCommentInput("");
  };

  useEffect(() => {
    // console.log(user);
    const getComments = async () => {
      const q = query(
        collection(firestore, `posts/${post?.id}/commentsCollection`),
        limit(limitNum)
      );

      onSnapshot(
        q,
        (docs) => {
          const comments = docs.docs.map((doc) => ({
            ...doc.data(),
            id: doc?.id,
          }));
          // console.log(comments);
          setLiked(post?.likedBy?.includes(user?.uid));
          setSaved(post?.savedBy?.includes(user?.uid));
          setCommentsArr(comments);
        },
        (err) => {
          console.log(err);
        }
      );
    };
    getComments();
  }, [limitNum]);

  return (
    <div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="sm:mb-6 bg-stone-200 border-color-gray-100[1px] rounded "
    >
      <div className="flex gap-3 items-center text-white-100 p-2 justify-between">
        <Link to={`/${post?.user?.username}`}>
          <img
            src={
              post?.user?.photoURL ||
              "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
            }
            className="rounded-full h-8 w-8 object-cover "
            alt={post?.user?.fullName}
          />
        </Link>
        <div className="flex-grow">
          <Link to={`/${post?.user?.username}`} className="font-semibold">
            {post?.user?.username}
          </Link>
        </div>
        <button>
          <PostMenuIcon />
        </button>
      </div>
      <Link to={`/p/${post?.id}`}>
        {!post?.carouselMedia && (
          <div className="relative aspect-square">
            <LazyLoadImage
              // effect="blur"
              src={post?.singleMedia?.src || post?.carouselMedia[0]?.src}
              placeholderSrc="https://cutewallpaper.org/24/image-placeholder-png/index-of-img.png"
              alt={post?.id}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        {post?.carouselMedia && (
          <div className="relative">
            <Swiper
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              // onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={(e) => console.log(e)}
              modules={[Pagination]}
            >
              {post?.carouselMedia.map((media, index) => (
                <SwiperSlide key={index}>
                  <LazyLoadImage
                    src={media?.src}
                    placeholderSrc="https://cutewallpaper.org/24/image-placeholder-png/index-of-img.png"
                    alt={post?.id}
                    className="h-full w-full object-cover"
                  />
                </SwiperSlide>
              ))}
              <button
                onClick={() => swiper.slidePrev()}
                className="absolute top-[50%] translate-y-[-50%] right-3 p-1 aspect-square rounded-full bg-gray-100 text-slate-800 backdrop-opacity-50 z-50"
              >
                <NextIcon />
              </button>
              <button
                onClick={() => swiper.slideNext()}
                className="absolute top-[50%] translate-y-[-50%] rotate-180 left-3 p-1 aspect-square rounded-full bg-gray-100 text-slate-800 backdrop-opacity-50 z-50"
              >
                <NextIcon />
              </button>
            </Swiper>
          </div>
        )}
      </Link>
      <div className="p-3">
        <div className="flex text-2xl  md:py-3 w-full">
          <div className="flex w-full text-white-100 gap-2">
            {liked ? (
              <button onClick={unlikePost}>
                <HandFillIcon color="#D2FA00" />
              </button>
            ) : (
              <button onClick={likePost}>
                <HandIcon size={25} />
              </button>
            )}
            <button onClick={saved ? unsavePost : savePost}>
            {saved ? <PropuestFillIcon color="#246BFD"/> : <PropuestIcon color="white"/>}
          </button>
            <button>
              <ShareIcon />
            </button>
          </div>
        </div>
        <div className="text-sm text-white-100 font-semibold">
          {post?.likedBy?.length > 0 && (
            <>{post?.likedBy?.length?.toLocaleString()} likes</>
          )}
          <div className="my-2">
            {post?.caption && (
              <div className="text-sm text-white-100">
                <Link to={`/${post.user.username}`} className="font-bold">
                  {post?.user?.username}
                </Link>{" "}
                {post?.caption}
              </div>
            )}
          </div>
          {commentsArr?.length > 0 && (
            <div
              onClick={() => setLimitNum(limitNum + 5)}
              className="block text my-3 text-white-100 cursor-pointer"
            >
              View more comments
            </div>
          )}
        </div>
        <div className="flex flex-col text-white-100 gap-3" id="#comments">
          {commentsArr?.map((comment) => (
            // console.log(comment),
            <div key={comment?.id} className="flex justify-between gap-2">
              <div>
                <Link to={`/${comment?.username}`}>
                  <img
                    src={
                      comment?.photoURL ||
                      "https://parkridgevet.com.au/wp-content/uploads/2020/11/Profile-300x300.png"
                    }
                    className="h-8 w-8 rounded-full aspect-square object-fill"
                    alt={comment?.fullName}
                  />
                </Link>
              </div>
              <div className="flex flex-grow gap-1">
                <b className="inline-flex">
                  <Link to={`/${comment?.username}`}>{comment?.username}</Link>
                  {comment?.isVerified && (
                    <span className="aspect-square rounded-full text-blue-500">
                      <VerifiedIcon />
                    </span>
                  )}
                </b>
                <span className="font-normal">
                  {comment?.comment?.length > 20
                    ? `${comment?.comment?.slice(0, 20)}...`
                    : comment?.comment}
                </span>
              </div>
              {/* <div>{comment?.commentedAt?.toDate().toLocaleTimeString()}</div> */}
            </div>
          ))}
        </div>
      </div>
      <div className=" sm:block sm:border-t-[1px] text-dm-900 p-3 border-gray-100">
        <form onSubmit={commentSubmit}>
          <div className="flex items-center gap-3">
            <CommentIcon size={24} color="#FCFCFC"/>
            <input
              type="text"
              className="w-full text-white-100 outline-none font-dark bg-stone-200"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={commentInput.length <= 0}
              className="text-blue-100 font-semibold text-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePostCard;
