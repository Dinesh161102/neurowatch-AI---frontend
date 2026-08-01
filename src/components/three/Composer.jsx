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
    // Prevent renderer from clearing before postprocessing
    gl.autoClear = false;

    const composer = new EffectComposer(gl);

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
  }, [gl, scene, camera, size.width, size.height, bloomOptions, vignetteOptions]);

  useEffect(() => {
    if (!composerRef.current) return;

    composerRef.current.setSize(size.width, size.height);
  }, [size.width, size.height]);

  useFrame(() => {
    composerRef.current?.render();
  }, 100);

  return null;
}