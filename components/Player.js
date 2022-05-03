import { HandIcon, VolumeOffIcon as VolumeDownIcon } from "@heroicons/react/outline";
import { RewindIcon,SwitchHorizontalIcon, FastForwardIcon, PauseIcon, PlayIcon, VolumeUpIcon, ReplyIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
const _ = require("lodash")

function Player(){
    const spotifyAPI = useSpotify();
    const {data:  session, status } =   useSession();
    const [currentTrackId, setCurrentIdTrack ] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying ] = useRecoilState(isPlayingState);
    const [volume, setVolume ] = useState(50);

    const songInfo =  useSongInfo();
    const fetchCurrentSong = ()=>{
        if(!songInfo){
            spotifyAPI.getMyCurrentPlayingTrack().then((data) =>{
                console.log("Now Playing...", data.body?.item);
                setCurrentIdTrack(data.body?.item?.id)
                spotifyAPI.getMyCurrentPlaybackState().then((data)=>{
                    setIsPlaying(data.body?.is_playing)
                })
            });
        }
    }

    const handlePlayPause =()=>{
        spotifyAPI.getMyCurrentPlaybackState().then(data=>{
            if(data.body.isPlaying){
                spotifyAPI.pause();
                setIsPlaying(false)
            }
            else{
                spotifyAPI.play();
                setIsPlaying(true)
            }
        });
    };

    useEffect(()=>{
        if(spotifyAPI.getAccessToken() && !currentTrackId)
        {
            fetchCurrentSong();
            setVolume(50);
        }
    },[currentTrackId, spotifyAPI, session])

    useEffect(()=>{
        if (volume > 0 && volume < 100){
            debouncedAdjustVolume(volume)
        }
    },[volume]);

    const debouncedAdjustVolume = useCallback(
        _.debounce((volume)=>{
            spotifyAPI.setVolume(volume).catch((err)=>{});
        },500),[]
    )
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4 ">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0].url} alt=""/>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Center */}
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon onClick={()=> spotifyAPI.skipToPrevious()}
                 className="button"/>

                 {isPlaying ? (
                     <PauseIcon onClick={()=> setIsPlaying(false) && spotifyAPI.pause()} className="button w-10 h-10 " />
                 ):(
                    <PlayIcon onClick={()=> setIsPlaying(true) && spotifyAPI.play()} className="button w-10 h-10" />
                 )}

                 <FastForwardIcon
                  onClick={()=>{spotifyAPI.skipToNext()}}
                 className="button"/>
                <ReplyIcon className="button"/>
            </div>
            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={()=> volume > 0 && setVolume(volume * 0)} className="button"/>
                    <input className="w-14 md:w-28 " type="range" value={volume} min={0} max={100}
                    onChange={(e)=> setVolume(Number(e.target.value))} />
                <VolumeUpIcon onClick={()=> volume < 100 && setVolume(volume + 10)} className="button"/>
            </div>
        </div>
    )
}

export default Player;