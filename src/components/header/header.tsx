// import { useAuthStore } from '@/store';
// import { useRouter } from 'next/navigation';
// import React from 'react';
// import { Button } from '../ui';
// import { authApi } from '@/lib/api-services';

// const Header = () => {
//   const router = useRouter();
//   const { user, clearAuth } = useAuthStore();

//   const handleLogout = () => {
//     authApi.logout();
//     clearAuth();
//     router.push('/login');
//   };

//   return (
//     <header className="bg-white shadow">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Bangladesh Post Office
//           </h1>
//           <p className="text-sm text-gray-600">ePassport Issuing Portal</p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="text-right">
//             <p className="text-sm font-medium text-gray-900">
//               {user?.name || user?.user_id || "User"}
//             </p>
//             <p className="text-xs text-gray-600">Welcome</p>
//           </div>
//           <Button variant="outline" size="sm" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;