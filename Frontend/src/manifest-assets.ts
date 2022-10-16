export const manifest = {
  bundles:[{
    name:'load-screen',
    assets:[
      {
        name: 'background',
        srcs: 'sunset.png',
      },
      {
        name: 'bar',
        srcs: 'load-bar.{png,webp}',
      }
    ]
  },
    {
      name:'game-screen',
      assets:[
        {
          name: 'character',
          srcs: 'robot.png',
        },
        {
          name: 'enemy',
          srcs: 'bad-guy.png',
        }
      ]
    }]
}
