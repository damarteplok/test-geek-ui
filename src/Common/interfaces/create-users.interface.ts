export interface CreateUsers {
	email: string;
	password: string;
	name?: string;
	address?: string;
	contact?: string;
	avatar?: string;
	status?: UserStatusEnum;
	roles?: number[];
	img?: any;
}

enum UserStatusEnum {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	BLOCKED = 'blocked',
}
