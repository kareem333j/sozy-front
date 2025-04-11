import { formatDistanceStrict } from "date-fns";
import { ar } from "date-fns/locale";

export default function formatYoutubeTime(timestamp) {
    return formatDistanceStrict(new Date(timestamp), new Date(), { 
        addSuffix: true, 
        locale: ar 
    });
}