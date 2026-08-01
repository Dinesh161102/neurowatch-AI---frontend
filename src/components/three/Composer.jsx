import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  VignetteEffect,
} from "postprocessing";

export default function Composer({
  bloomOptions = {},
  vignetteOptions = {},
}) {
  const composerRef = useRef(null);

  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    // Better compatibility with postprocessing
    gl.autoClear = false;

    const composer = new EffectComposer(gl);

    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);

    const bloom = new BloomEffect({
      mipmapBlur: true,
      ...bloomOptions,
    });

    const vignette = new VignetteEffect({
      ...vignetteOptions,
    });

    const effectPass = new EffectPass(
      camera,
      bloom,
      vignette
    );

    effectPass.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(effectPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
      composerRef.current = null;
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!composerRef.current) return;

    composerRef.current.setPixelRatio(window.devicePixelRatio);
    composerRef.current.setSize(size.width, size.height);
  }, [size]);

  useFrame(() => {
    composerRef.current?.render();
  }, 100);

  return null;
}