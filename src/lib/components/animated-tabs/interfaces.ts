export type AnimationType = 'opacity'

export interface AnimationModel {
  delay: number,
  type: AnimationType,
}

export interface AnimatedTabsConfigModel {
  animation: AnimationModel;
}
