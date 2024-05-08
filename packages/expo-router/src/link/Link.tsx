// Fork of @react-navigation/native Link.tsx with `href` and `replace` support added and
// `to` / `action` support removed.
import { PropsWithChildren, forwardRef, useMemo, MouseEvent, ForwardedRef } from 'react';
import { Text, GestureResponderEvent, Platform } from 'react-native';

import { Slot } from './LinkSlot';
import { resolveHref } from './href';
import useLinkToPathProps from './useLinkToPathProps';
import { useRouter } from '../hooks';
import { Href } from '../types';
import { useFocusEffect } from '../useFocusEffect';
import { useInteropClassName, useHrefAttrs, LinkProps, WebAnchorProps } from './useLinkHooks';

export interface LinkComponent {
  <T extends string | object>(props: PropsWithChildren<LinkProps<T>>): JSX.Element;
  /** Helper method to resolve a Href object into a string. */
  resolveHref: (href: Href) => string;
}

/** Redirects to the href as soon as the component is mounted. */
export function Redirect({ href }: { href: Href }) {
  const router = useRouter();
  useFocusEffect(() => {
    try {
      router.replace(href);
    } catch (error) {
      console.error(error);
    }
  });
  return null;
}

/**
 * Component to render link to another route using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.href Absolute path to route (e.g. `/feeds/hot`).
 * @param props.replace Should replace the current route without adding to the history.
 * @param props.push Should push the current route, always adding to the history.
 * @param props.asChild Forward props to child component. Useful for custom buttons.
 * @param props.children Child elements to render the content.
 * @param props.unstable_ignoreAnchor  Ignore the anchor if navigating to a new navigator .
 * @param props.className On web, this sets the HTML `class` directly. On native, this can be used with CSS interop tools like Nativewind.
 */
export const Link = forwardRef(ExpoRouterLink) as unknown as LinkComponent;

Link.resolveHref = resolveHref;

function ExpoRouterLink(
  {
    href,
    replace,
    push,
    // TODO: This does not prevent default on the anchor tag.
    relativeToDirectory,
    asChild,
    rel,
    target,
    download,
    withAnchor,
    ...rest
  }: LinkProps<any>,
  ref: ForwardedRef<Text>
) {
  // Mutate the style prop to add the className on web.
  const style = useInteropClassName(rest);

  // If not passing asChild, we need to forward the props to the anchor tag using React Native Web's `hrefAttrs`.
  const hrefAttrs = useHrefAttrs({ asChild, rel, target, download });

  const resolvedHref = useMemo(() => {
    if (href == null) {
      throw new Error('Link: href is required');
    }
    return resolveHref(href);
  }, [href]);

  let event;
  if (push) event = 'PUSH';
  if (replace) event = 'REPLACE';

  const props = useLinkToPathProps({
    href: resolvedHref,
    event,
    relativeToDirectory,
    withAnchor,
  });

  const onPress = (e: MouseEvent<HTMLAnchorElement> | GestureResponderEvent) => {
    if ('onPress' in rest) {
      rest.onPress?.(e);
    }
    props.onPress(e);
  };

  const Element = asChild ? Slot : Text;

  // Avoid using createElement directly, favoring JSX, to allow tools like NativeWind to perform custom JSX handling on native.
  return (
    <Element
      ref={ref}
      {...props}
      {...hrefAttrs}
      {...rest}
      style={style}
      {...Platform.select({
        web: {
          onClick: onPress,
        } as any,
        default: { onPress },
      })}
    />
  );
}

export { LinkProps, WebAnchorProps };
