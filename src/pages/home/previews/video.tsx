import { Box } from "@hope-ui/solid"
import { createSignal, onCleanup, onMount } from "solid-js"
import { getMainColor, getSettingBool } from "~/store"
import Artplayer from "artplayer"
import mpegts from "mpegts.js"
import Hls from "hls.js"
import { VideoBox } from "./video_box"
import "./artplayer.css"

const Preview = () => {
  let player: Artplayer
  let flvPlayer: mpegts.Player
  let hlsPlayer: Hls

  // 极简播放配置
  let option = {
    container: "#video-player",
    volume: 1.0,
    autoplay: getSettingBool("video_autoplay"),
    autoSize: false,
    autoMini: false,
    loop: false,
    flip: false,
    playbackRate: true,
    aspectRatio: true,
    screenshot: true,
    setting: true,
    hotkey: true,
    pip: true,
    mutex: true,
    fullscreen: true,
    fullscreenWeb: true,
    subtitleOffset: false,
    miniProgressBar: false,
    playsInline: true,
    theme: getMainColor(),
    
    // 清空 上一个/下一个 按钮
    controls: [],
    
    quality: [],
    plugins: [],
    whitelist: [],
    settings: [],
    
    moreVideoAttr: {
      playsInline: true,
      crossOrigin: "anonymous",
    },
    
    customType: {
      flv: function (video: HTMLMediaElement, url: string) {
        flvPlayer?.destroy()
        flvPlayer = mpegts.createPlayer({ type: "flv", url })
        flvPlayer.attachMediaElement(video)
        flvPlayer.load()
      },
      m2ts: function (video: HTMLMediaElement, url: string) {
        flvPlayer?.destroy()
        flvPlayer = mpegts.createPlayer({ type: "m2ts", url })
        flvPlayer.attachMediaElement(video)
        flvPlayer.load()
      },
      m3u8: function (video: HTMLMediaElement, url: string) {
        hlsPlayer?.destroy()
        hlsPlayer = new Hls()
        hlsPlayer.loadSource(url)
        hlsPlayer.attachMedia(video)
        if (!video.src) video.src = url
      },
    },
    lock: false,
    fastForward: true,
    autoPlayback: false,
    autoOrientation: false,
    airplay: false,
  }

  // 只播放，不加载字幕、弹幕、列表
  const switchUrl = (url: string) => {
    const playing = player.playing
    player.pause()
    player.switchUrl(url).finally(() => playing && player.play())
  }

  onMount(() => {
    player = new Artplayer(option)
  })

  onCleanup(() => {
    if (player) {
      player.destroy()
    }
    flvPlayer?.destroy()
    hlsPlayer?.destroy()
  })

  // 最纯净结构：只留视频
  return (
    <Box w="$full" h="100vh" id="video-player" style="margin:0; padding:0; background:#000"/>
  )
}

export default Preview
