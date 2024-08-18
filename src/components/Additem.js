import React, { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import styles from "./styles/Additem.module.css";
import { Tag } from "./Tag";

export function Additem() {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const fileInputRef = useRef(null);

  const [formValues, setFormValues] = useState({
    productImg: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productTag: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const onChangeNum = (e) => {
    const { value } = e.target;
    let str = value.replaceAll(",", "");
    setFormValues((prevValues) => ({
      ...prevValues,
      productPrice: str,
    }));
  };

  const addComma = (num) => {
    let returnString = num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return returnString;
  };

  const isFilled = Object.entries(formValues)
    .filter(([key]) => key !== "productTag")
    .every(([_, value]) => value.trim() !== "");

  //file 이미지 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleFileClick = (e) => {
    if (file) {
      setError("*이미지 등록은 최대 1개까지 가능합니다.");
      e.preventDefault();
    }
  };

  const handleDeleteBtn = (e) => {
    e.preventDefault();
    setFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleTagDeleteBtn = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    const tagValue = formValues.productTag.trim();
    if (tagValue) {
      setTags((prevTags) => [...prevTags, tagValue]);
      setFormValues((prevValues) => ({
        ...prevValues,
        productTag: "",
      }));
    }
  };

  useEffect(() => {
    if (!file) return;

    const nextPreview = URL.createObjectURL(file);
    setPreview(nextPreview);

    return () => URL.revokeObjectURL(nextPreview);
  }, [file]);

  return (
    <>
      <Header />
      <main>
        <form className={styles.addForm} action="#">
          <h1 className={styles.pageName}>상품 등록하기</h1>

          <label className={styles.labelName}>
            상품 이미지
            <input
              id="addImg"
              className={styles.hiddenInput}
              onChange={handleFileChange}
              name="productImg"
              type="file"
              accept="image/jpeg, image/png"
              ref={fileInputRef}
            ></input>
            <div className={styles.fileInputWrapper}>
              {/* 파일 인풋 대체 div */}
              <div
                className={styles.fileAddImg}
                onClick={handleFileClick}
              ></div>

              {/* 이미지 파일 미리보기 */}
              <div className={styles.filePreview}>
                {preview && (
                  <img
                    src={preview}
                    alt="이미지 미리보기"
                    className={styles.previewImg}
                  />
                )}
              </div>
              {/* 파일 삭제 버튼 */}
              {preview && (
                <button
                  className={styles.deleteBtn}
                  type="button"
                  onClick={handleDeleteBtn}
                ></button>
              )}
            </div>
            {/* 파일 개수 제한 에러메시지 */}
            {error && <b className={styles.errorMsg}>{error}</b>}
          </label>

          <label className={styles.labelName}>
            상품명
            <input
              id="addName"
              onChange={handleChange}
              name="productName"
              placeholder="상품명을 입력해주세요"
              type="text"
            ></input>
          </label>

          <label className={styles.labelName}>
            상품 소개
            <textarea
              id="addDescription"
              name="productDescription"
              placeholder="상품 소개를 입력해주세요"
              onChange={handleChange}
            ></textarea>
          </label>

          <label className={styles.labelName}>
            판매 가격
            <input
              id="addPrice"
              name="productPrice"
              placeholder="판매 가격을 입력해주세요"
              type="text"
              value={addComma(formValues.productPrice) || ""}
              onChange={onChangeNum}
            ></input>
          </label>
          <button
            type="submit"
            disabled={!isFilled}
            className={`${styles.addBtn} ${!isFilled ? styles.disabled : ""}`}
          >
            등록
          </button>
        </form>

        <form onSubmit={handleTagSubmit} className={styles.addForm}>
          <label className={styles.labelName}>
            태그
            <input
              id="addTag"
              onChange={handleChange}
              name="productTag"
              placeholder="태그를 입력해주세요"
              type="text"
              value={formValues.productTag}
            ></input>
            <div>
              {tags.map((tag, index) => (
                <span>
                  <Tag key={index} value={tag} />
                  <button
                    type="button"
                    className={styles.TagDeleteBtn}
                    onClick={() => handleTagDeleteBtn(tag)}
                  ></button>
                </span>
              ))}
            </div>
            <button type="submit" className={styles.hiddenInput}></button>
          </label>
        </form>
      </main>
    </>
  );
}
