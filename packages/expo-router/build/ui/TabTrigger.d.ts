import { TabNavigationState } from '@react-navigation/native';
import { ReactNode, ReactElement, ComponentProps } from 'react';
import { View, PressableProps } from 'react-native';
import { ExpoTabsResetValue } from './TabRouter';
import type { TriggerMap } from './common';
import type { Href } from '../types';
type PressablePropsWithoutFunctionChildren = Omit<PressableProps, 'children'> & {
    children?: ReactNode | undefined;
};
export type TabTriggerProps<T extends string | object> = PressablePropsWithoutFunctionChildren & {
    /** Name of tab. When used within a `<TabList />` this sets the name of the tab. Otherwise, this references the name. */
    name: string;
    /** Name of tab. Required when used within a `<TabList />` */
    href?: Href<T>;
    /** Forward props to child component. Useful for custom wrappers. */
    asChild?: boolean;
    /** Reset the route when switching to the tab */
    reset?: SwitchToOptions['reset'] | 'onLongPress';
};
export type TabTriggerOptions<T extends string | object> = {
    name: string;
    href: Href<T>;
};
export type TabTriggerSlotProps = PressablePropsWithoutFunctionChildren & React.RefAttributes<View> & {
    isFocused?: boolean;
    href?: string;
};
/**
 * Creates a trigger to navigate to a tab. `<TabTrigger />` functionality slightly changes when used as a child of `<TabList />`. In this instance, the `href` prop is required, and the trigger also defines what routes are present in the `<Tabs />`.
 *
 * When used outside of `<TabList />`, `<TabTrigger />` no longer requires a `href`.
 *
 * @example
 * ```ts
 * <Tabs>
 *  <TabSlot />
 *  <TabList>
 *   <TabTrigger name="home" href="/" />
 *  </TabList>
 * </Tabs>
 * ```
 */
export declare function TabTrigger<T extends string | object>({ asChild, name, href, reset, ...props }: TabTriggerProps<T>): import("react").JSX.Element;
/**
 * @hidden
 */
export declare function isTabTrigger(child: ReactElement<any>): child is ReactElement<ComponentProps<typeof TabTrigger>>;
/**
 * Options for `switchTab` function.
 */
export type SwitchToOptions = {
    /** Navigate and reset the history */
    reset?: ExpoTabsResetValue;
};
export type Trigger = TriggerMap[string] & {
    isFocused: boolean;
    resolvedHref: string;
    route: TabNavigationState<any>['routes'][number];
};
export type UseTabTriggerResult = {
    switchTab: (name: string, options: SwitchToOptions) => void;
    getTrigger: (name: string) => Trigger | undefined;
    trigger?: Trigger;
    triggerProps: TriggerProps;
};
export type TriggerProps = {
    isFocused: boolean;
    onPress: PressableProps['onPress'];
    onLongPress: PressableProps['onLongPress'];
};
/**
 * Utility hook creating custom `<TabTrigger />`
 */
export declare function useTabTrigger(options: TabTriggerProps<any>): UseTabTriggerResult;
export {};
//# sourceMappingURL=TabTrigger.d.ts.map