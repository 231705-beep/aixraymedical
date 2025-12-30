import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import lungsModel from '../../assets/models/lungs.glb';

export default function LungsModel(props) {
    const { scene } = useGLTF(lungsModel);
    const ref = useRef();

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.005;
        }
    });

    return <primitive object={scene} ref={ref} {...props} />;
}

useGLTF.preload(lungsModel);
