import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AboutDevice {
    isTouchDevice: boolean;
    setIsTouchDevice: (isTouch: boolean) => void;
}

export const useAboutDeviceInfo = create<AboutDevice>()(
    persist(
        (set, get) => ({
            isTouchDevice: false,
            setIsTouchDevice: (isTouch: boolean) => set({ isTouchDevice: isTouch }),
        }),
        {
            name: 'about-device',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
