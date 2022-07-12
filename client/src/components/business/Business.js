/* eslint-disable react/prop-types */
import React  from 'react';
import './Business.css';

// Checks platform
import platform from '../../data/getMobile/getMobile';

export const Business = (props) => {
	const os = platform();
	const basePath = '../../data/yelp_stars' + (os === 'android' ? '/android' : '/web_and_ios') + '/regular';
	let fileName = `/regular_${Math.floor(props.rating)}`;
	if (props.rating % 1 === 0.5)
		fileName += '_half';
	fileName += '.png';

	const handleClick = () => {
		window.open(props.link);
	};

	return (
		<div className="Business">
			<div className="image-container">
				<img src={props.imageSrc} alt={props.name} onClick={handleClick} />
			</div>
			<div className='Title-and-Yelp-Logo'>
				<h2>{props.name}</h2>
				<img src={'../../data/yelp_logo/Yelp_Logo.png'} className='yelp-logo' onClick={handleClick} />
			</div>
			<div className="Business-information">
				<div className="Business-address">
					<p>{props.address}</p>
					<p>{props.city}</p>
					<p>{props.state + ' ' + props.zipCode}</p>
				</div>
				<div className="Business-reviews">
					<h3>{props.category}</h3>
					<img src={basePath + fileName} alt={`Rating of ${props.rating}`} onClick={handleClick} />
					<p>{props.reviewCount} reviews</p>
				</div>
			</div>
		</div>
	);
};