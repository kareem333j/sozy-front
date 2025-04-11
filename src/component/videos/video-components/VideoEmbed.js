const VideoEmbed = ({ embedCode }) => {
    return (
        <div className="video-wrapper">
            <iframe
                src={extractSrc(embedCode)}
                allowFullScreen
                allow="encrypted-media"
                title="video"
            ></iframe>
        </div>
    );
};

const extractSrc = (embedCode) => {
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : "";
};


export default VideoEmbed;
