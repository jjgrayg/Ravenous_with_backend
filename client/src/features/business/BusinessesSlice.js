import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
 
function isEmptyObject(obj){
	return JSON.stringify(obj) === '{}';
}

export const fetchBusinessesWithSearch = createAsyncThunk(
	'businesses/getBusinesses',
	async (searchObj) => {
		let url = `/api/business?term=${searchObj.term}`;
		if (searchObj.location === '') {
			url += `&latitude=${encodeURI(searchObj.computerLocation.lat)}&longitude=${encodeURI(searchObj.computerLocation.lng)}`;
		}
		else {
			url += `&location=${searchObj.location}`;
		}
		url += `&sort_by=${searchObj.sortBy}`;
		const response = await fetch(url);
		const json = await response.json();
		console.log(json);
		if (json.businesses) {
			const businessArray = json.businesses.map(business => {
				if (business.image_url && business.location.address1 && business.location.city &&
					business.location.state && business.location.zip_code && business.categories[0]?.title &&
					business.rating && business.rating && business.id && business.url && business.name)
					return {
						imageSrc: business.image_url,
						address: business.location.address1,
						city: business.location.city,
						state: business.location.state,
						zipCode: business.location.zip_code,
						category: business.categories[0]?.title,
						rating: business.rating,
						reviewCount: business.review_count,
						id: business.id,
						url: business.url,
						name: business.name
					};
			}).filter(business => business !== undefined);
			return businessArray;
		}
		return [];
	}
);

export const fetchAutofillRecommendations = createAsyncThunk(
	'businesses/autofillRecommendations',
	async ({term, location}) => {
		if (term) {
			let url = `/api/autocomplete?text=${term}`;
			if (location.lat !== undefined && location.lng !== undefined) {
				url += `&latitude=${encodeURI(location.lat)}&longitude=${encodeURI(location.lng)}`;
			}
			const response = await fetch(url);
			const json = await response.json();
			return json;
		}
		return {};
	}
);

export const BusinessesSlice = createSlice({
	name: 'businesses',
	initialState: {
		loading: false,
		error: false,
		businessArray: [],
		autofillRecommendations: [],
		beenModified: false
	},
	reducers: {
		addBusiness: (state, action) => {
			action.payload.id = uuidv4();
			state.businessArray.push(action.payload);
			state.beenModified = true;
		},
		removeBusiness: (state, action) => {
			state.businessArray = state.businessArray.filter(business => business.id !== action.payload);
			state.beenModified = true;
		},
		replaceBusinesses: (state, action) => {
			state.businessArray = action.payload;
			state.beenModified = true;
		}
	},
	extraReducers: {
		[fetchBusinessesWithSearch.pending]: state => {
			state.loading = true;
			state.error = false;
			state.beenModified = true;
		},
		[fetchBusinessesWithSearch.rejected]: state => {
			state.loading = false;
			state.error = true;
			state.beenModified = true;
		},
		[fetchBusinessesWithSearch.fulfilled]: (state, action) => {
			state.loading = false;
			state.error = false;
			state.businessArray = action.payload;
			state.beenModified = true;
		},
		[fetchAutofillRecommendations.fulfilled]: (state, action) => {
			let recommendations = [];
			if (!isEmptyObject(action.payload)) {
				for (let i = 0; i < action.payload.categories?.length; i++) {
					recommendations.push(action.payload.categories[i].alias);
				}
				for (let i = 0; i < action.payload.businesses?.length; i++) {
					recommendations.push(action.payload.businesses[i].name);
				}
				for (let i = 0; i < action.payload.terms?.length; i++) {
					recommendations.push(action.payload.terms[i].text);
				}
			}
			state.autofillRecommendations = recommendations;
		}
	}
});

export default BusinessesSlice.reducer;
export const { addBusiness, removeBusiness, replaceBusinesses } = BusinessesSlice.actions;
export const selectBusinesses = state => state.businesses.businessArray;
export const selectLoading = state => state.businesses.loading;
export const selectError = state => state.businesses.error;
export const selectRecommendations = state => state.businesses.autofillRecommendations;
export const selectModified = state => state.businesses.beenModified;