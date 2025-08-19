import React from 'react';

const Header = () => {
    return (
        <div className="w-full overflow-hidden">
            <header 
                className="flex items-center justify-between p-4 bg-black text-white gap-[20px] mx-auto"
                style={{
                    width: '1350px',
                    height: '42px',
                    opacity: 1,
                    position: 'absolute',
                    top: '15px',
                    left: '7px'
                }}
            >
                {/* Empty div to balance the flex justify-between */}
                <div className="w-[394px]"></div>
                
                {/* Search Box - Centered */}
                <div className="relative w-[394px] h-[42px] ml-[100px]">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                                stroke="#0EFF7B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M17.5 17.5L13.875 13.875"
                                stroke="#0EFF7B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Input Box */}
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-full rounded-[40px] bg-[#0EFF7B1A] border border-[#0EFF7B1A] pl-12 pr-4 py-1 
                        text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                </div>

                {/* Icons Group */}
                <div className="flex items-center gap-[20px]">
                    {/* Settings Icon */}
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E4E4E7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.32-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .7.4 1.32 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .7.4 1.32 1 1.51H21a2 2 0 0 1 0 4h-.09c-.7 0-1.32.4-1.51 1z" />
                        </svg>
                    </button>

                    {/* Notification Bell Icon */}
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16 7C16 5.4087 15.3679 3.88258 14.2426 2.75736C13.1174 1.63214 11.5913 1 10 1C8.4087 1 6.88258 1.63214 5.75736 2.75736C4.63214 3.88258 4 5.4087 4 7C4 12 1 14 1 14H19C19 14 16 12 16 7Z"
                                stroke="#E4E4E7"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M11.73 15C11.5542 15.3031 11.3019 15.5547 10.9982 15.7295C10.6946 15.9044 10.3504 15.9965 10 15.9965C9.64964 15.9965 9.30541 15.9044 9.00179 15.7295C8.69818 15.5547 8.44583 15.3031 8.27002 15"
                                stroke="#E4E4E7"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                    </button>
                    
                    {/* Mail Icon */}
                    <button className="p-2 rounded-full hover:bg-gray-800 transition-colors relative">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 4C18 2.9 17.1 2 16 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H16C17.1 18 18 17.1 18 16V4Z"
                                stroke="#E4E4E7"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M18 6L10 11L2 6"
                                stroke="#E4E4E7"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                    </button>

                    {/* Profile Divider */}
                    <div className="h-6 w-px bg-gray-700 mx-1"></div>

                    {/* Profile */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-medium">
                            JD
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">John Doe</span>
                            <span className="text-xs text-gray-400">Admin</span>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400 group-hover:text-emerald-400 transition-colors"
                        >
                            <path
                                d="M6 9L12 15L18 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;