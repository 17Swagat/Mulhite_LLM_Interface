import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface SearchedDoc {
    _id: Id<'test_table'>;
    _creationTime: number;
    message: string;
    optionalTag: string | null;
    numericValue: number;
    integerValue: number;
}

export function SearchComponent() {
    const [searchedQuery, setSearchedQuery] = useState<string>('');
    const fetchSearchedDocs = useQuery(api.testing.test_table.fetchSearchedDocs, {
        searchTerm: searchedQuery,
    });

    return (
        <div>
            <input
                value={searchedQuery}
                type="text"
                placeholder="Search for 'larry'"
                className="border border-gray-300 p-2 rounded-lg mb-4"
                onChange={(e) => setSearchedQuery(e.currentTarget.value)}
            />
            <div className="bg-blue-400 space-y-2">
                {fetchSearchedDocs === undefined && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-purple-500"></div>
                )}
                {fetchSearchedDocs &&
                    fetchSearchedDocs.map((doc) => (
                        <div key={doc._id} className="bg-amber-700 p-2">
                            <div>Message: {doc.message}</div>
                            <div>Tag: {doc.optionalTag ?? 'None'}</div>
                            <div>Numeric Value: {doc.numericValue}</div>
                            <div>Integer Value: {doc.integerValue}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
}