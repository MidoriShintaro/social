import React, { useContext, useEffect, useRef, useState } from "react";
import "./Message.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faImage,
  faPenToSquare,
  faHeart as faHeartRe,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faCircleInfo,
  faEllipsis,
  faHeart as faHeartSo,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/context";
import api from "../../axios/axios";
import Conversation from "../../components/conversation/Conversation";
import NoMessage from "../../components/noMessage/NoMessage";
import { io } from "socket.io-client";
import { sha256 } from "crypto-hash";

export default function Message({user}) {
  const [conversation, setConversation] = useState([]);
  const [chat, setChat] = useState({});
  const [messages, setMessage] = useState([]);
  const [friend, setFriend] = useState({});
  const [content, setContent] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [targetMessage, setTargetMessage] = useState({});
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likedMessage, setLikedMessage] = useState("");
  const [isOnline, setIsOnline] = useState([]);
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const { currentUser } = useContext(AuthContext);
  // const { user } = currentUser;
  const socketRef = useRef();
  const socketURL = "http://localhost:4000";
  const friendId =
    chat?.members?.find((f) => f !== user._id) === undefined
      ? ""
      : chat?.members?.find((f) => f !== user._id);
  const photo = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    socketRef.current = io(socketURL);
    socketRef.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        content: data.content,
        image: data.image,
        createdAt: Date.now(),
      });
    });

    socketRef.current.on("likeMessage", (data) => {
      setLikedMessage({
        sender: data.senderId,
        isLiked: data.messageLike,
        createdAt: Date.now(),
      });
    });

    socketRef.current.on("dislikeMessage", (data) => {
      setLikedMessage({
        sender: data.senderId,
        isLiked: data.messageLike,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    setIsLiked(chat?.likes?.includes(user?._id));
  }, [user, chat]);

  useEffect(() => {
    if (arrivalMessage && chat?.members?.includes(arrivalMessage.sender)) {
      console.log(arrivalMessage);
      setMessage((preMess) => [...preMess, arrivalMessage]);
    }
  }, [arrivalMessage, chat]);

  useEffect(() => {
    if (likedMessage && chat?.members?.includes(likedMessage.sender)) {
      console.log(likedMessage);
      setMessage((preMess) => [...preMess, likedMessage]);
    }
  }, [likedMessage, chat]);

  useEffect(() => {
    socketRef.current.emit("sendUser", user._id);
    socketRef.current.on("getUser", (users) => {
      setIsOnline(users.filter((u) => u.userId !== user._id));
    });
  }, [user]);

  useEffect(() => {
    const getConversation = async () => {
      const res = await api.get(`/conversation/${user?._id}`);
      setConversation(res.data.conversation);
    };
    getConversation();
  }, [user, currentUser]);

  useEffect(() => {
    const getMessage = async () => {
      const res = await api.get(`/message/${chat?._id}`);
      setMessage(res.data.message);
    };
    getMessage();
  }, [chat, targetMessage, currentUser]);

  useEffect(() => {
    const getFriend = async () => {
      const res = await api.get(`/user/${friendId}`);
      setFriend(res.data.user);
    };
    getFriend();
  }, [friendId, currentUser]);

  const handleSendImage = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    } else {
      setImage("");
    }
  };

  const handleUnSendMessage = async () => {
    await api.delete(`/message/${targetMessage?._id}`);
  };

  const handleLikeMessage = async () => {
    const res = await api.patch("/conversation/liked", {
      userId: user._id,
      friendId,
    });
    if (res.data.message.startsWith("Like")) {
      socketRef.current.emit("like", { user, friend });
      const response = await api.post("/message", {
        conversationId: chat._id,
        sender: user._id,
        content: "",
        isLiked: "like",
      });
      setMessage([...messages, response.data.message]);
    } else {
      socketRef.current.emit("dislike", { user, friend });
      const response = await api.post("/message", {
        conversationId: chat._id,
        sender: user._id,
        content: "",
        isLiked: "dislike",
      });
      setMessage([...messages, response.data.message]);
    }
    if (res.data.status === "success") {
      setIsLiked(!isLiked);
    }
  };
  console.log(messages);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let filename = "";
    if (content === "" && image === "") {
      return;
    }

    if (image) {
      const ext = image.name.split(".")[1];
      const hashImage = await sha256(image.name);
      filename = hashImage + "." + ext;
    }

    const receiverId = chat?.members?.find((mem) => mem !== user._id);
    socketRef.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      content,
      image: filename,
    });

    const data = new FormData();
    data.append("conversationId", chat?._id);
    data.append("sender", user._id);
    data.append("content", content);
    data.append("image", image);
    const res = await api.post("/message", data, {
      headers: { Authorization: `Bearer ${currentUser.accessToken}` },
    });

    setMessage([...messages, res.data.message]);
    setContent("");
    setPreviewImage("");
    setImage("");
  };

  return (
    <div className="h-full">
      <div className="case">
        <div className="container">
          <div className="left">
            <div className="top">
              <div className="tub">
                <div className="username">
                  {user?.username}
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
              </div>
              <div className="card">
                <FontAwesomeIcon icon={faPenToSquare} />
              </div>
            </div>
            <div className="conversations">
              {conversation.map((con) => (
                <div
                  className="person"
                  key={con._id}
                  onClick={() => setChat(con)}
                >
                  <Conversation
                    conversation={con}
                    user={currentUser}
                    mess={messages}
                    key={con._id}
                    isOnline={isOnline}
                  />
                </div>
              ))}
            </div>
          </div>
          {JSON.stringify(chat) !== "{}" ? (
            <div className="right">
              <div className="top">
                <div className="box">
                  <div className="image">
                    <img
                      src={photo + "/users/" + friend?.picturePhoto}
                      alt=""
                      className="w-8 h-8"
                    />
                  </div>
                  <div
                    className={
                      isOnline.find((o) => o.userId === friendId)
                        ? "online bg-green-400"
                        : "online bg-gray-400"
                    }
                  ></div>
                </div>

                <div className="information">
                  <div className="username">
                    <a href="https://www.instagram.com/">{friend?.username}</a>
                  </div>
                </div>

                <div className="options">
                  <button className="info">
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </button>
                </div>
              </div>
              <div className="middle">
                <div className="tumbler">
                  {messages?.map((mes) => (
                    <div
                      className={`${
                        mes.content === "" && mes.isLiked === ""
                          ? ""
                          : "messages"
                      }`}
                      key={mes._id}
                    >
                      <div
                        className={`${
                          mes.sender === user._id
                            ? "clip sent"
                            : "clip received"
                        }`}
                        key={mes._id}
                      >
                        {mes.content !== "" &&
                          (mes.image === "" || mes.image !== "") && (
                            <div
                              className={`${
                                (!mes.content || mes.content === "") &&
                                mes.isLiked
                                  ? `hidden`
                                  : "text"
                              }`}
                              key={mes._id}
                            >
                              {mes.content}
                              {mes.image && (
                                <img
                                  src={photo + "/messages/" + mes.image}
                                  alt=""
                                />
                              )}
                            </div>
                          )}
                        {mes.image && mes.content === "" && (
                          <img
                            src={photo + "/messages/" + mes.image}
                            alt=""
                            className="w-64 m-4"
                          />
                        )}
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          className={`mx-4 text-gray-400 ${
                            (!mes.content || mes.content === "") && mes.isLiked
                              ? "hidden"
                              : " mess-option"
                          } ${
                            isShowPopup && mes._id === targetMessage._id
                              ? "inline-block"
                              : "hidden"
                          }`}
                          onClick={() => {
                            setTargetMessage(mes);
                            setIsShowPopup(!isShowPopup);
                          }}
                        />
                        <div className="pop-up">
                          <p
                            className={`pop-up-text ${
                              isShowPopup && mes._id === targetMessage._id
                                ? "block"
                                : "hidden"
                            }`}
                            onClick={handleUnSendMessage}
                          >
                            Un Send
                          </p>
                        </div>
                      </div>
                      <div className="text-center text-gray-400 text-sm font-medium">
                        {(mes.content === "" || !mes.content) &&
                          mes.sender === user._id &&
                          mes.isLiked &&
                          `You ${mes?.isLiked} ${friend?.username}`}
                        {(mes.content === "" || !mes.content) &&
                          mes.sender !== user._id &&
                          mes.isLiked &&
                          `${friend?.username} ${mes.isLiked} you`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bottom">
                <form className="cup" onSubmit={handleSubmit}>
                  <div className="picker">
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </div>
                  {previewImage && (
                    <img src={previewImage} alt="" className="w-24" />
                  )}
                  <input
                    id="message"
                    placeholder="Message..."
                    className="w-full focus:outline-none outline-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  {!content && !previewImage ? (
                    <>
                      <div className="picker photo">
                        <label htmlFor="image" className="hover:cursor-pointer">
                          <FontAwesomeIcon icon={faImage} />
                        </label>
                        <input
                          type="file"
                          id="image"
                          hidden
                          onChange={(e) => handleSendImage(e)}
                        />
                      </div>

                      <div className="picker photo">
                        <FontAwesomeIcon
                          icon={isLiked === true ? faHeartSo : faHeartRe}
                          onClick={handleLikeMessage}
                          className={`hover:cursor-pointer ${
                            isLiked ? "text-red-500" : ""
                          }`}
                        />
                      </div>
                    </>
                  ) : (
                    <button type="submit" className="send">
                      Send
                    </button>
                  )}
                </form>
              </div>
            </div>
          ) : (
            <NoMessage />
          )}
        </div>
      </div>
    </div>
  );
}
