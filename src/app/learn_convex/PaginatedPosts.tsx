import { usePaginatedQuery } from "convex/react"
import { api } from "@/../convex/_generated/api"
import { useEffect, useState } from "react"
// import {} from '@/../convex/_generated/server/paginate';
import { Id } from "../../../convex/_generated/dataModel"


interface PagiType {
    _id: Id<"test_table">;
    _creationTime: number;
    message: string;
    user: string;
}

export const PaginatedPosts = () => {

    const [reset, setReset] = useState(false);

    const { results: pagiPostsByUser, isLoading, loadMore, status: paginateStatus } = usePaginatedQuery(
        api.testing.messages.messagesByUserPaginated, { reset }, { initialNumItems: 2 }
    )

    const [shownResults, setShownResults] = useState<PagiType[]>([]);

    useEffect(() => {
        setShownResults(pagiPostsByUser)
    }, [pagiPostsByUser, paginateStatus])

    return (
        <>
            {shownResults &&
                <div className="flex flex-col text-2xl gap-2 space-y-2">


                    {shownResults?.map((doc) => {
                        return (
                            <div key={doc._id} className="bg-green-500 w-fit">
                                {doc.message}
                            </div>
                        )
                    })}

                    {(isLoading && (paginateStatus == "LoadingFirstPage")) && <div className="w-10 h-10 border-2 border-pink-500 rounded-full animate-ping"></div>}

                    <button type="button" className="bg-pink-400"
                        onClick={() => {
                            if (paginateStatus == "CanLoadMore") {
                                loadMore(2);
                            } else if (paginateStatus == "Exhausted") {
                                setReset(prev => !prev)
                            }
                        }}>
                        {(paginateStatus != 'Exhausted') ? 'Load More' : 'Collapse'}
                    </button>
                </div>
            }



        </>
    )
}