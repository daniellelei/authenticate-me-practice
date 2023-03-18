import {useEffect, useState} from 'react';
import './starInput.css';

const StarsRatingInput = ({rating, disabled, onChange}) => {
    const [activeRating, setActiveRating] = useState(rating);

    useEffect(()=>{
        setActiveRating(rating)
    }, [rating]);

    const pawsIcon = (number) => {
    const props = {};
    if (!disabled) {
      props.onMouseEnter = () => setActiveRating(number);
      props.onMouseLeave = () => setActiveRating(rating);
      props.onClick = () => onChange(number);
    }
    return (
      <div
        key={number}
        className={activeRating >= number ? "filled" : "empty"}
        {...props}
      >
        <i class="fa-sharp fa-solid fa-star"></i>
      </div>
    );
  };

  return (
    <div className="rating-input">
      {[1, 2, 3, 4, 5].map((number) => pawsIcon(number))}
    </div>
  );

    // return (
    //     <div className="rating-input">
    //   <div
    //     className={activeRating >= 1 ? "filled" : "empty"}
    //     onMouseEnter={() => {
    //       if (!disabled) setActiveRating(1);
    //     }}
    //     onMouseLeave={() => {
    //       if (!disabled) setActiveRating(rating);
    //     }}
    //     onClick={() => {
    //       if (!disabled) onChange(1);
    //     }}
    //   >
    //     <i class="fa-sharp fa-solid fa-star"></i>
    //   </div>
    //   <div
    //     className={activeRating >= 2 ? "filled" : "empty"}
    //     onMouseEnter={() => {
    //       if (!disabled) setActiveRating(2);
    //     }}
    //     onMouseLeave={() => {
    //       if (!disabled) setActiveRating(rating);
    //     }}
    //     onClick={() => {
    //       if (!disabled) onChange(2);
    //     }}
    //   >
    //     <i class="fa-sharp fa-solid fa-star"></i>
    //   </div>
    //   <div
    //     className={activeRating >= 3 ? "filled" : "empty"}
    //     onMouseEnter={() => {
    //       if (!disabled) setActiveRating(3);
    //     }}
    //     onMouseLeave={() => {
    //       if (!disabled) setActiveRating(rating);
    //     }}
    //     onClick={() => {
    //       if (!disabled) onChange(3);
    //     }}
    //   >
    //     <i class="fa-sharp fa-solid fa-star"></i>
    //   </div>
    //   <div
    //     className={activeRating >= 4 ? "filled" : "empty"}
    //     onMouseEnter={() => {
    //       if (!disabled) setActiveRating(4);
    //     }}
    //     onMouseLeave={() => {
    //       if (!disabled) setActiveRating(rating);
    //     }}
    //     onClick={() => {
    //       if (!disabled) onChange(4);
    //     }}
    //   >
    //     <i class="fa-sharp fa-solid fa-star"></i>
    //   </div>
    //   <div
    //     className={activeRating >= 5 ? "filled" : "empty"}
    //     onMouseEnter={() => {
    //       if (!disabled) setActiveRating(5);
    //     }}
    //     onMouseLeave={() => {
    //       if (!disabled) setActiveRating(rating);
    //     }}
    //     onClick={() => {
    //       if (!disabled) onChange(5);
    //     }}
    //   >
    //     <i class="fa-sharp fa-solid fa-star"></i>
    //   </div>
    // </div>
    // )
}

export default StarsRatingInput;