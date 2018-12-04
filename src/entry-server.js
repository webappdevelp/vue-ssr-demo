import { createApp } from './app';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 所有匹配的路由调用页面组件的asyncData 处理预取的数据并更新到store内
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          });
        }
      })).then(() => {
        // 将预取的数据放入server中的上下文，并提供给后续的render方法渲染template
        context.state = store.state;

        resolve(app);
      }).catch(reject);
    }, reject);
  });
};
