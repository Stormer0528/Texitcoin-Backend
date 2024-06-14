import { Prisma } from '@prisma/client';
import { ArgsType, Field } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

interface OrderBy {
  [key: string]: Prisma.SortOrder;
}

@ArgsType()
export abstract class QueryArgsBase<WhereType> {
  @Field({ nullable: true })
  sort?: string;

  @Field({ nullable: true })
  page?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  filter?: Record<string, any>;

  get orderBy(): OrderBy | OrderBy[] | undefined {
    return this.sort?.split(',').map((field) => {
      const order: Prisma.SortOrder = field.startsWith('-') ? 'asc' : 'desc';
      return {
        [field.replace('-', '')]: order,
      };
    });
  }

  get parsePage(): { take?: number; skip?: number } {
    if (!this.page) {
      return {};
    }

    const [page, limit] = this.page.split(',').map((value) => parseInt(value));

    return {
      take: limit,
      skip: page * limit - limit,
    };
  }

  // This is for type generation, does not validate any actual inputs
  get where(): WhereType | undefined {
    return Prisma.validator<WhereType>()(this.filter as any);
  }
}
