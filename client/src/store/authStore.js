import {create} from 'zustand';
import {persist} from 'zustand/middleware';


export const useAuthStore = create(
    persist(
        (set) => ({
            user : null,
            token : null,
            isAuthenticated : false,
            theme : "light",


            setAuth : (user, token) => set({
                user, 
                token, 
                isAuthenticated : true,
            }),


            updateUser : (updateUser) => set(
                (state) => ({
                    user : {
                        ...state.user, ...updateUser
                    },
                }),               
            ),

            themeToggle : () => set(
                (state) => ({
                   theme: state.theme === "light" ? "dark" : "light"

                })
            ),

            setTheme : (theme) => ({theme}),

            logout : () => set({
                user : null,
                token : null,
                isAuthenticated : false,
            })
        }),

        {
            name : "auth-storage",
            partialize : (state) => ({
                user : state.user,
                token : state.token,
                isAuthenticated : state.isAuthenticated,
                theme : state.theme,
            }),    
        }
    )
);


