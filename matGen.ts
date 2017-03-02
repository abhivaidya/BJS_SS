class MatGen
{
    private static instance: MatGen;

    private constructor()
    {
        // do something construct...
    }

    static getInstance()
    {
        if (!MatGen.instance)
        {
            MatGen.instance = new MatGen();
            // ... any one time initialization goes here ...
        }

        return MatGen.instance;
    }
}
