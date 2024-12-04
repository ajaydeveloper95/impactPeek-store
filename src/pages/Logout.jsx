// // src/components/Logout.js
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { logoutUser } from '../redux/action'; // Assuming you have a logout action

// const Logout = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const logout = async () => {
//             try {
//                 // Call your logout API endpoint
//                 await axios.get('https://test.yunicare.in/apiAdmin/v1/user/logout'); // Adjust URL as needed
//                 // Clear tokens from localStorage
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 // Dispatch logout action
//                 dispatch(logoutUser());
//                 // Redirect to login page
//                 navigate('/login');
//             } catch (error) {
//                 console.error('Logout failed:', error);
//             }
//         };

//         logout();
//     }, [dispatch, navigate]);

//     return (
//         <div className="text-center my-3">
//             <h2>Logging out...</h2>
//         </div>
//     );
// };

// export default Logout;
