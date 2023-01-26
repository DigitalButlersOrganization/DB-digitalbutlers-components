export type AnimationType = 'basic' | 'opacity' | 'fade' | 'slide'

export interface AnimationModel {
  delay: number,
  type: AnimationType,
}

export interface AnimatedTabsConfigModel {
  animation: AnimationModel;
}
